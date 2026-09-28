import { RiddleItem } from '../types';

export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below
    }
  }

  // Fallback for older browsers
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}

export function formatRiddleForShare(riddle: RiddleItem): string {
  return `💡 *חידה משלוף:*
${riddle.question}

||תשובה: ${riddle.answer}||
🏷️ ${riddle.subCategory}`;
}

export function formatPakalForWhatsApp(riddles: RiddleItem[]): string {
  if (!riddles.length) return '';

  const header = `🎒 *הפק"ל שלי - אפליקציית שלוף* 🎒\n_${riddles.length} חידות והפעלות שטח מוכנות:_\n\n`;
  const items = riddles
    .map((r, i) => `${i + 1}. *${r.question}*\n   תשובה: ${r.answer}\n   [${r.subCategory}]`)
    .join('\n\n');

  const footer = `\n\n✨ _נשלף באמצעות אפליקציית "שלוף" - פק"ל שטח למדריכים_`;
  return header + items + footer;
}

export async function shareContent(title: string, text: string): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text
      });
      return true;
    } catch {
      // User cancelled share or not allowed
    }
  }
  return await copyToClipboard(text);
}

export const DEFAULT_PUBLIC_URL = 'https://shluf-pakal.vercel.app';

/**
 * Returns the public web domain to ensure WhatsApp links are 100% valid and clickable for students
 */
export function getBaseShareUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_PUBLIC_URL;

  const hostname = window.location.hostname;
  const isLocal = !hostname || hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.');

  if (isLocal) {
    const customDomain = localStorage.getItem('shluf_public_domain');
    if (customDomain && customDomain.startsWith('http')) {
      return customDomain.replace(/\/$/, '');
    }
    return DEFAULT_PUBLIC_URL;
  }

  return (window.location.origin + window.location.pathname).replace(/\/$/, '');
}

/**
 * Generates simple, direct student link that opens the rebus drawing directly
 */
export function getStudentShareUrl(riddleId: string): string {
  const baseUrl = getBaseShareUrl();
  return `${baseUrl}/?riddle=${riddleId}`;
}

export function formatVisualRiddleForWhatsApp(riddleTitle: string, studentUrl: string): string {
  return `🧩 חידת ציורים: *${riddleTitle}*

לחצו על הקישור לפתיחת האיור:
${studentUrl}

💡 מה מסתתר בציור? כתבו את התשובה בקבוצה!`;
}

export async function shareToWhatsApp(text: string, directUrl?: string): Promise<boolean> {
  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // On mobile devices, native share sheet opens WhatsApp directly and creates a clean clickable link card
  if (isMobile && navigator.share) {
    try {
      await navigator.share({
        title: 'חידת ציורים',
        text: text,
        url: directUrl
      });
      return true;
    } catch {
      // User cancelled native share sheet or not supported, fallback to direct whatsapp url
    }
  }

  const encoded = encodeURIComponent(text);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;

  if (typeof window !== 'undefined') {
    if (isMobile) {
      window.location.href = whatsappUrl;
    } else {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
    return true;
  }
  return false;
}

export function downloadVisualImage(imageUrl: string, filename: string): void {
  if (typeof window === 'undefined') return;
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = filename || 'riddle.svg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

