/**
 * Parse site datetime strings (local, no Z) for pickers and calendar links.
 */
export function parseLocalDateTime(isoString) {
  const date = new Date(isoString)
  return Number.isNaN(date.getTime()) ? new Date() : date
}

export function toLocalDateTimeIso(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
  )
}
