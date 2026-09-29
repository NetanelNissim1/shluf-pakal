import { FeedbackSubmission } from '../types';
import { usePakalStore } from '../store/usePakalStore';

export interface FeedbackResult {
  success: boolean;
  offline: boolean;
  message?: string;
}

/**
 * Send user feedback or store in local outbox if offline.
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
    const payload = {
      ...data,
      clientTimestamp: Date.now(),
      currentScreen: data.currentScreen || (typeof window !== 'undefined' ? window.location.pathname : '')
    };

    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
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
 * Sync all pending feedback items to the server when connection is restored.
 */
export async function flushPendingFeedbackQueue(): Promise<void> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return;

  const store = usePakalStore.getState();
  const queue = [...store.pendingFeedbackQueue];
  if (queue.length === 0) return;

  for (const item of queue) {
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(item)
      });

      if (res.ok) {
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
