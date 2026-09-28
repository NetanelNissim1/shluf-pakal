/**
 * Security and Anti-Scraping / Content Protection Utilities for Shluf
 */

// XOR Key for data obfuscation
const OBFUSCATION_KEY = 'Shluf_Pakal_Security_Key_2026_Secure_Field_Content';

// Precomputed key bytes
const keyBytes = new TextEncoder().encode(OBFUSCATION_KEY);

/**
 * Obfuscate plain string (UTF-8 safe)
 */
export function obfuscateData(plainText: string): string {
  const textBytes = new TextEncoder().encode(plainText);
  const xorBytes = new Uint8Array(textBytes.length);
  for (let i = 0; i < textBytes.length; i++) {
    xorBytes[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
  }

  let binary = '';
  const len = xorBytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(xorBytes[i]);
  }
  return btoa(binary);
}

/**
 * De-obfuscate payload at runtime in memory (UTF-8 safe)
 */
export function deobfuscateData<T>(encodedText: string): T {
  try {
    const binary = atob(encodedText);
    const xorBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      xorBytes[i] = binary.charCodeAt(i);
    }

    const textBytes = new Uint8Array(xorBytes.length);
    for (let i = 0; i < xorBytes.length; i++) {
      textBytes[i] = xorBytes[i] ^ keyBytes[i % keyBytes.length];
    }

    const decodedString = new TextDecoder().decode(textBytes);
    return JSON.parse(decodedString) as T;
  } catch (err) {
    console.error('Failed to unpack secure content:', err);
    throw new Error('Integrity check failed');
  }
}

/**
 * Sanitize search inputs to prevent injection and RegExp DoS
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query) return '';
  const cleaned = query.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim();
  return cleaned.slice(0, 100);
}

/**
 * Escape regular expression special characters
 */
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Initialize anti-scraping and content theft barriers
 * Blocks right-click context menu, bulk text selection, and save/inspect shortcuts
 */
export function initContentProtection(): () => void {
  if (typeof window === 'undefined') return () => {};

  // 1. Block right-click context menu on riddle cards & content
  const handleContextMenu = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      return;
    }
    e.preventDefault();
  };

  // 2. Block keyboard shortcuts for scraping, printing, saving or inspecting
  const handleKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

    if (
      e.key === 'F12' ||
      ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
      ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's' || e.key === 'P' || e.key === 'p')) ||
      (!isInput && (e.ctrlKey || e.metaKey) && (e.key === 'A' || e.key === 'a'))
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // 3. Block drag and drop of content
  const handleDragStart = (e: DragEvent) => {
    e.preventDefault();
  };

  // 4. Block manual clipboard copying outside search/input fields
  const handleCopy = (e: ClipboardEvent) => {
    const target = e.target as HTMLElement;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      return;
    }
    e.preventDefault();
  };

  window.addEventListener('contextmenu', handleContextMenu);
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('dragstart', handleDragStart);
  window.addEventListener('copy', handleCopy);
  window.addEventListener('cut', handleCopy);

  return () => {
    window.removeEventListener('contextmenu', handleContextMenu);
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('dragstart', handleDragStart);
    window.removeEventListener('copy', handleCopy);
    window.removeEventListener('cut', handleCopy);
  };
}
