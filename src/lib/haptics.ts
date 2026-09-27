/**
 * Outdoor Haptic Feedback utility for mobile field interactions
 */
export function triggerHaptic(pattern: number | number[] = 50): void {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration errors if not allowed by browser permissions
    }
  }
}
