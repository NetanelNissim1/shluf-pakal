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

export function formatVisualRiddleForWhatsApp(riddleTitle: string, studentUrl: string): string {
  return `🧩 *חידת ציורים ורבוס שטח למעגל התלמידים!* 🧩
"${riddleTitle}"

🔍 *היכנסו לקישור הבא לצפייה באיור במסך מלא עם זום (ללא פתרון):*
${studentUrl}

💡 *הוראות:* חקרו את פרטי הציור, חברו את הרמזים וכתבו את הפתרון שלכם כאן בקבוצה! בהצלחה! ✨`;
}

export function shareToWhatsApp(text: string): void {
  const encoded = encodeURIComponent(text);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;
  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }
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

