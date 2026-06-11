/** Short tap pattern for confirmations (iOS Safari when supported). */
export function hapticConfirm() {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([12, 48, 12])
    }
  } catch {
    // Vibration API unavailable or blocked
  }
}
