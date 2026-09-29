import type { IncomingMessage, ServerResponse } from 'http';

interface FeedbackRequestBody {
  name: string;
  message: string;
  category: string;
  email?: string;
  organization?: string;
  currentScreen?: string;
  clientTimestamp?: number;
  bot_trap?: string;
}

// In-memory rate limiting map: ip -> array of request timestamps
const ipRequestsMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

// Clean up stale IPs periodically
function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [ip, timestamps] of ipRequestsMap.entries()) {
    const valid = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    if (valid.length === 0) {
      ipRequestsMap.delete(ip);
    } else {
      ipRequestsMap.set(ip, valid);
    }
  }
}

const CATEGORY_HEBREW_MAP: Record<string, string> = {
  'riddle-idea': '💡 רעיון לחידה או תוכן',
  'site-improvement': '⚡ הצעה לייעול האתר',
  'bug-report': '🐛 דיווח על שיבוש/תקלה',
  'general': '💬 משוב כללי'
};

export default async function handler(req: any, res: any) {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const body: FeedbackRequestBody = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    // 1. Honeypot Bot Trap: If filled, silently drop and succeed
    if (body.bot_trap && body.bot_trap.trim().length > 0) {
      return res.status(200).json({ success: true, message: 'Received' });
    }

    // 2. Validate mandatory fields
    const name = (body.name || '').trim().slice(0, 100);
    const message = (body.message || '').trim().slice(0, 2500);
    const category = body.category || 'general';
    const email = (body.email || '').trim().slice(0, 120);
    const organization = (body.organization || '').trim().slice(0, 120);
    const currentScreen = (body.currentScreen || 'ראשי').slice(0, 100);

    if (!name || !message) {
      return res.status(400).json({ success: false, message: 'שם ותוכן ההודעה הם שדות חובה' });
    }

    // 3. Rate Limiting per IP
    cleanupRateLimitMap();
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 
                     req.socket?.remoteAddress || 
                     'unknown';

    const now = Date.now();
    const existing = ipRequestsMap.get(clientIp) || [];
    const recent = existing.filter(t => now - t < RATE_LIMIT_WINDOW_MS);

    if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
      return res.status(429).json({ 
        success: false, 
        message: 'התקבלו יותר מדי פניות בזמן קצר. אנא נסו שוב בעוד מספר דקות.' 
      });
    }

    recent.push(now);
    ipRequestsMap.set(clientIp, recent);

    // 4. Format clean Hebrew email content
    const categoryTitle = CATEGORY_HEBREW_MAP[category] || category;
    const formattedDate = new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });

    const subject = `💡 הצעת ייעול חדשה משלוף פק"ל: ${categoryTitle} - מאת ${name}`;
    
    const textContent = `
התקבלה הצעת ייעול חדשה מאתר שלוף פק"ל:
======================================================
👤 שם הפונה: ${name}
🏢 מסגרת הדרכה / חברה: ${organization || 'לא צוין'}
📧 מייל לחזרה: ${email || 'לא צוין (פנייה לידיעה בלבד)'}
🏷️ נושא הפנייה: ${categoryTitle}
📍 נשלח מתוך מסך: ${currentScreen}
⏱️ תאריך ושעה: ${formattedDate}
======================================================
📝 תוכן ההצעה:
${message}
======================================================
    `.trim();

    const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fdfbf7; color: #292524; padding: 20px; line-height: 1.6; }
    .card { background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 16px; padding: 24px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { border-bottom: 2px solid #f59e0b; padding-bottom: 12px; margin-bottom: 20px; }
    .header h2 { margin: 0; color: #b45309; font-size: 20px; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; }
    .meta-table td { padding: 8px 12px; border-bottom: 1px solid #f5f5f4; }
    .meta-label { font-weight: bold; color: #78716c; width: 140px; }
    .meta-val { color: #1c1917; font-weight: 500; }
    .message-box { background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 16px; font-size: 15px; white-space: pre-wrap; color: #1c1917; line-height: 1.7; }
    .footer { margin-top: 24px; font-size: 12px; color: #a8a29e; text-align: center; border-top: 1px solid #f5f5f4; padding-top: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>💡 הצעת ייעול חדשה משלוף פק"ל</h2>
    </div>
    <table class="meta-table">
      <tr>
        <td class="meta-label">👤 שם הפונה:</td>
        <td class="meta-val">${name}</td>
      </tr>
      <tr>
        <td class="meta-label">🏢 מסגרת / חברה:</td>
        <td class="meta-val">${organization || 'לא צוין'}</td>
      </tr>
      <tr>
        <td class="meta-label">📧 מייל לחזרה:</td>
        <td class="meta-val">${email ? `<a href="mailto:${email}">${email}</a>` : 'לא צוין (פנייה לידיעה בלבד)'}</td>
      </tr>
      <tr>
        <td class="meta-label">🏷️ נושא הפנייה:</td>
        <td class="meta-val">${categoryTitle}</td>
      </tr>
      <tr>
        <td class="meta-label">📍 מסך מקור:</td>
        <td class="meta-val">${currentScreen}</td>
      </tr>
      <tr>
        <td class="meta-label">⏱️ תאריך ושעה:</td>
        <td class="meta-val">${formattedDate}</td>
      </tr>
    </table>
    <h3 style="font-size: 15px; margin-bottom: 8px; color: #78716c;">📝 תוכן ההצעה:</h3>
    <div class="message-box">${message}</div>
    <div class="footer">
      הודעה זו נשלחה אוטומטית מתוך אתר שלוף פק"ל (shluf-pakal.org)
    </div>
  </div>
</body>
</html>
    `.trim();

    const targetRecipient = process.env.FEEDBACK_RECIPIENT || 'info.shluf.pakal@gmail.com';

    // 5. Send via Resend if RESEND_API_KEY is available
    if (process.env.RESEND_API_KEY) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Shluf Pakal Feedback <feedback@shluf-pakal.org>',
          to: [targetRecipient],
          reply_to: email || undefined,
          subject,
          text: textContent,
          html: htmlContent
        })
      });

      if (!resendRes.ok) {
        console.warn('Resend returned error status:', resendRes.status);
      }
    }

    // 6. Send via Web3Forms (Secure Server-Side Dispatch)
    const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY || 'b0e565eb-1234-4926-b21a-fe2d600ec143';
    if (web3formsKey) {
      const web3Res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://shluf-pakal.org',
          'Referer': 'https://shluf-pakal.org/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: JSON.stringify({
          access_key: web3formsKey,
          name,
          email: email || undefined,
          from_name: 'שלוף פק"ל',
          subject,
          message: textContent
        })
      });

      const resData = await web3Res.json().catch(() => null);
      if (!web3Res.ok || (resData && !resData.success)) {
        console.error('Web3Forms dispatch error:', resData);
        return res.status(500).json({
          success: false,
          message: 'שגיאה בשליחת המייל דרך שרת המשוב.'
        });
      }
    }

    // Return success to the client
    return res.status(200).json({
      success: true,
      message: 'ההצעה התקבלה בהצלחה!'
    });

  } catch (err: any) {
    console.error('Feedback submission error:', err);
    return res.status(500).json({
      success: false,
      message: 'אירעה שגיאה בעיבוד הפנייה.'
    });
  }
}
