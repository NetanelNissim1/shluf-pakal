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
  return `${baseUrl}/?riddle=${encodeURIComponent(riddleId)}`;
}

export function formatVisualRiddleForWhatsApp(categoryLabel: string, studentUrl: string): string {
  return `🧩 *חידה בציורים מאפליקציית שלוף!* (${categoryLabel})

🔎 לחצו על הקישור לפתיחת האיור:
${studentUrl}

💡 מה מסתתר בציור? נסו לפצח וכתבו את התשובה בקבוצה!`;
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

export async function convertSvgUrlToPngBlob(svgUrl: string): Promise<Blob> {
  const resp = await fetch(svgUrl);
  const svgText = await resp.text();
  const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1800;
      canvas.height = 1100;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        return reject(new Error('Canvas context unavailable'));
      }
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, 1800, 1100);
      ctx.drawImage(img, 0, 0, 1800, 1100);
      URL.revokeObjectURL(objectUrl);

      canvas.toBlob((pngBlob) => {
        if (pngBlob) resolve(pngBlob);
        else reject(new Error('Failed to create PNG blob'));
      }, 'image/png');
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(objectUrl);
      reject(e);
    };
    img.src = objectUrl;
  });
}

export async function shareVisualImageToWhatsApp(
  svgUrl: string, 
  categoryLabel: string, 
  studentUrl: string
): Promise<boolean> {
  const text = formatVisualRiddleForWhatsApp(categoryLabel, studentUrl);

  // Try native file share first (sends actual PNG image directly to WhatsApp)
  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
    try {
      const pngBlob = await convertSvgUrlToPngBlob(svgUrl);
      const file = new File([pngBlob], 'shluf-riddle.png', { type: 'image/png' });

      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'חידה בציורים - שלוף',
          text: text
        });
        return true;
      }
    } catch {
      // User cancelled or file sharing failed, fallback to link share
    }
  }

  // Fallback: share text + student link
  return await shareToWhatsApp(text, studentUrl);
}

export async function downloadVisualAsPng(svgUrl: string, filename: string): Promise<void> {
  try {
    const pngBlob = await convertSvgUrlToPngBlob(svgUrl);
    const url = URL.createObjectURL(pngBlob);
    const link = document.createElement('a');
    link.href = url;
    const cleanName = filename.replace(/\.svg$/i, '');
    link.download = `${cleanName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch {
    downloadVisualImage(svgUrl, filename);
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

