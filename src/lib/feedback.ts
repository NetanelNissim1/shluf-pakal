import { FeedbackSubmission } from '../types';
import { usePakalStore } from '../store/usePakalStore';

export interface FeedbackResult {
  success: boolean;
  offline: boolean;
  message?: string;
}

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
// Anonymous Access Key tied securely on Web3Forms server to recipient inbox
const ACCESS_KEY = 'b0e565eb-1234-4926-b21a-fe2d600ec143';

const CATEGORY_HEBREW_MAP: Record<string, string> = {
  'riddle-idea': '💡 רעיון לחידה או תוכן',
  'site-improvement': '⚡ הצעה לייעול האתר',
  'bug-report': '🐛 דיווח על שיבוש/תקלה',
  'general': '💬 משוב כללי'
};

function createFeedbackFormData(data: FeedbackSubmission): FormData {
  const categoryTitle = CATEGORY_HEBREW_MAP[data.category] || data.category;
  const formattedDate = new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });

  const formattedMessage = `
התקבלה הצעת ייעול חדשה מאתר שלוף פק"ל:
======================================================
👤 שם הפונה: ${data.name.trim()}
🏢 מסגרת הדרכה / חברה: ${data.organization?.trim() || 'לא צוין'}
📧 מייל לחזרה: ${data.email?.trim() || 'לא צוין (פנייה לידיעה בלבד)'}
🏷️ נושא הפנייה: ${categoryTitle}
📍 נשלח מתוך מסך: ${data.currentScreen || 'ראשי'}
⏱️ תאריך ושעה: ${formattedDate}
======================================================
📝 תוכן ההצעה:
${data.message.trim()}
======================================================
  `.trim();

  const formData = new FormData();
  formData.append('access_key', ACCESS_KEY);
  formData.append('from_name', 'שלוף פק״ל');
  formData.append('subject', `💡 ${categoryTitle} - מאת ${data.name.trim()}`);
  formData.append('name', data.name.trim());
  if (data.email?.trim()) {
    formData.append('email', data.email.trim());
  }
  formData.append('category', categoryTitle);
  formData.append('organization', data.organization?.trim() || 'לא צוין');
  formData.append('message', formattedMessage);

  if (data.bot_trap) {
    formData.append('botcheck', data.bot_trap);
  }

  return formData;
}

/**
 * Send user feedback directly to secure Web3Forms endpoint or store in local outbox if offline.
 */
export async function sendFeedback(data: FeedbackSubmission): Promise<FeedbackResult> {
  const store = usePakalStore.getState();

  // Save user profile for next time
  store.saveFeedbackUserInfo({
    name: data.name,
    email: data.email,
    organization: data.organization
  });

  // If currently offline, queue immediately
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    store.queuePendingFeedback(data);
    return {
      success: true,
      offline: true,
      message: 'ההצעה נשמרה בהצלחה! היא תישלח אוטומטית כשתחזור לקליטה.'
    };
  }

  try {
    const formData = createFeedbackFormData(data);

    // Direct simple CORS request (No custom headers -> NO preflight -> No Cloudflare block!)
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      body: formData
    });

    const resData = await res.json().catch(() => null);

    if (res.ok && resData && resData.success) {
      return { success: true, offline: false };
    }

    // If server responded with error, still queue offline so suggestion is not lost
    store.queuePendingFeedback(data);
    return {
      success: true,
      offline: true,
      message: 'ההצעה נשמרה בהצלחה! ננסה לשלוח שוב ברקע.'
    };
  } catch {
    // Network failure (lost connection mid-flight) -> queue in outbox
    store.queuePendingFeedback(data);
    return {
      success: true,
      offline: true,
      message: 'נראה שאין קליטה יציבה. ההצעה נשמרה ותישלח ברגע שהקשר יחודש.'
    };
  }
}

/**
 * Sync all pending feedback items when connection is restored.
 */
export async function flushPendingFeedbackQueue(): Promise<void> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return;

  const store = usePakalStore.getState();
  const queue = [...store.pendingFeedbackQueue];
  if (queue.length === 0) return;

  for (const item of queue) {
    try {
      const formData = createFeedbackFormData(item);
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        body: formData
      });

      const resData = await res.json().catch(() => null);
      if (res.ok && resData && resData.success) {
        store.removePendingFeedback(item.id);
      }
    } catch {
      // Still no stable connection, will retry next time
      break;
    }
  }
}

/**
 * Initialize offline sync listeners
 */
export function initFeedbackSync(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('online', () => {
    // Small delay to allow connection handshake to stabilize
    setTimeout(flushPendingFeedbackQueue, 2500);
  });

  // Attempt sync on initial boot if online
  if (navigator.onLine) {
    setTimeout(flushPendingFeedbackQueue, 4000);
  }
}
