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

// Anti-Spam Rate Limiting (max 3 submissions per 15 minutes)
const RATE_LIMIT_KEY = 'shluf_feedback_timestamps';
const MAX_SUBMISSIONS_PER_WINDOW = 3;
const WINDOW_DURATION_MS = 15 * 60 * 1000;

export function checkFeedbackRateLimit(): { allowed: boolean; remainingMinutes?: number } {
  if (typeof window === 'undefined') return { allowed: true };
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();
    let timestamps: number[] = raw ? JSON.parse(raw) : [];
    timestamps = timestamps.filter(t => (now - t) < WINDOW_DURATION_MS);
    
    if (timestamps.length >= MAX_SUBMISSIONS_PER_WINDOW) {
      const oldestInWindow = Math.min(...timestamps);
      const remainingMinutes = Math.ceil((WINDOW_DURATION_MS - (now - oldestInWindow)) / 60000);
      return { allowed: false, remainingMinutes: Math.max(1, remainingMinutes) };
    }
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

export function recordFeedbackSubmissionTimestamp(): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();
    let timestamps: number[] = raw ? JSON.parse(raw) : [];
    timestamps = timestamps.filter(t => (now - t) < WINDOW_DURATION_MS);
    timestamps.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(timestamps));
  } catch {}
}

const CLIENT_ID_KEY = 'shluf_client_id';

/**
 * Retrieve or generate an anonymous, persistent Client ID for anti-spam tracking.
 */
export function getOrCreateClientId(): string {
  if (typeof window === 'undefined') return 'server_client';
  try {
    let id = localStorage.getItem(CLIENT_ID_KEY);
    if (!id) {
      const rand = Math.random().toString(36).substring(2, 9);
      id = `cl_${rand}_${Date.now().toString(36)}`;
      localStorage.setItem(CLIENT_ID_KEY, id);
    }
    return id;
  } catch {
    return 'anonymous_client';
  }
}

/**
 * Generate a friendly human-readable device and environment description.
 */
export function getFriendlyDeviceInfo(): string {
  if (typeof navigator === 'undefined') return 'לא זוהה';
  const ua = navigator.userAgent || '';

  // Operating system & device type
  let device = 'מכשיר לא מזוהה';
  if (/iPad/i.test(ua)) {
    device = 'טאבלט iPad (iOS)';
  } else if (/iPhone/i.test(ua)) {
    device = 'טלפון נייד (iPhone • iOS)';
  } else if (/Android/i.test(ua)) {
    device = /Mobile/i.test(ua) ? 'טלפון נייד (Android)' : 'טאבלט (Android)';
  } else if (/Win/i.test(ua)) {
    device = 'מחשב שולחני (Windows)';
  } else if (/Mac/i.test(ua)) {
    device = 'מחשב (Mac OS)';
  } else if (/Linux/i.test(ua)) {
    device = 'מחשב (Linux)';
  }

  // Browser detection
  let browser = '';
  if (/Edg/i.test(ua)) browser = 'Edge';
  else if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';

  return browser ? `${device} • ${browser}` : device;
}

const CATEGORY_HEBREW_MAP: Record<string, string> = {
  'riddle-idea': 'רעיון לחידה או תוכן',
  'site-improvement': 'הצעה לייעול האתר',
  'bug-report': 'דיווח על שיבוש או תקלה',
  'general': 'משוב כללי'
};

function createFeedbackFormData(data: FeedbackSubmission): FormData {
  const categoryTitle = CATEGORY_HEBREW_MAP[data.category] || data.category;
  const formattedDate = new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });

  // Clean, professional plain text with clear screen context and client device details
  const formattedMessage = `
שלום,

התקבלה פנייה חדשה ממערכת המשוב של אתר שלוף פק"ל:

• שם הפונה: ${data.name.trim()}
• מסגרת הדרכה / חברה: ${data.organization?.trim() || 'לא צוין'}
• מייל לחזרה: ${data.email?.trim() || 'לא צוין על ידי המשתמש (פנייה לידיעה בלבד)'}
• נושא הפנייה: ${categoryTitle}
• מסך / משחק באפליקציה: ${data.currentScreen || 'דף הבית'}
• סוג מכשיר וסביבה: ${data.deviceInfo || 'לא זוהה'}
• מזהה מכשיר ייחודי (Client ID למניעת הצפות): ${data.clientId || 'לא זמין'}
• תאריך ושעה: ${formattedDate}

תוכן ההצעה:
${data.message.trim()}

---
הודעה זו נשלחה אוטומטית מטופס המשוב באתר שלוף פק"ל (shluf-pakal.org)
  `.trim();

  const formData = new FormData();
  formData.append('access_key', ACCESS_KEY);
  formData.append('from_name', 'שלוף פקל');
  // Clean subject without emojis (prevents spam scoring triggers)
  formData.append('subject', `הצעת ייעול חדשה: ${categoryTitle} מאת ${data.name.trim()}`);
  formData.append('name', data.name.trim());
  
  // Web3Forms requires a valid email to avoid flagging submission as missing sender/spam
  const senderEmail = data.email?.trim() || 'feedback-guest@shluf-pakal.org';
  formData.append('email', senderEmail);
  
  formData.append('category', categoryTitle);
  formData.append('organization', data.organization?.trim() || 'לא צוין');
  formData.append('message', formattedMessage);

  if (data.currentScreen) formData.append('current_screen', data.currentScreen);
  if (data.deviceInfo) formData.append('device_info', data.deviceInfo);
  if (data.clientId) formData.append('client_id', data.clientId);

  // Honeypot field for bot trapping
  if (data.bot_trap && data.bot_trap.trim().length > 0) {
    formData.append('botcheck', data.bot_trap.trim());
  }

  return formData;
}

/**
 * Send user feedback directly to secure Web3Forms endpoint or store in local outbox if offline.
 */
export async function sendFeedback(data: FeedbackSubmission): Promise<FeedbackResult> {
  const store = usePakalStore.getState();

  // Rate Limiting Check
  const rateLimit = checkFeedbackRateLimit();
  if (!rateLimit.allowed) {
    return {
      success: false,
      offline: false,
      message: `נשלחו מספר פניות בזמן קצר. תודה על השיתוף! ניתן לשלוח שוב בעוד ${rateLimit.remainingMinutes} דקות.`
    };
  }

  // Record submission timestamp
  recordFeedbackSubmissionTimestamp();

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
