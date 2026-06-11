import { confirmation, weekendEvent } from '../config/content'

/**
 * Calendar days until the weekend start (local midnight comparison).
 */
export function getDaysUntilWeekendStart() {
  const [y, m, d] = weekendEvent.startIso.split('T')[0].split('-').map(Number)
  const startDay = new Date(y, m - 1, d)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((startDay - today) / (24 * 60 * 60 * 1000))
}

export function getWeekendCountdownLabel() {
  const days = getDaysUntilWeekendStart()
  if (days <= 0) return confirmation.countdownToday
  if (days === 1) return confirmation.countdownOneDay
  return confirmation.countdownDays(days)
}
