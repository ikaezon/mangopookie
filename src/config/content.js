/**
 * Editable content and configuration for mangopookie date ask.
 * Update names, copy, venue, and default datetime here.
 */

export const sender = {
  name: 'Kaevon',
  /** E.164 or US format for “text mango mando” — e.g. +16195551234 */
  phone: '+19518807350',
}

export const recipient = {
  name: 'Taite',
}

const EUROSUMMER_PHRASES = Array.from({ length: 24 }, (_, index) =>
  index % 2 === 0 ? 'eurosummer' : 'euro summer',
)

export const hero = {
  eyebrow: 'mangopookie',
  headline: () => 'Hi mangopookie',
  question: 'Wanna go on a date',
  subtextMarquee: `${EUROSUMMER_PHRASES.join(' ')} `,
}

export const noButton = {
  label: 'No',
  teasingLines: [
    'Nice try...',
    'Not so fast!',
    'You know the answer.',
    'The Yes button is right there.',
    'I am not letting you dodge this one.',
    'Almost had me worried for a second.',
  ],
}

export const yesButton = {
  label: 'Yes',
}

/** Default date: Friday June 12, 2026 7:00 PM local (Pacific). */
export const defaultDateTime = '2026-06-12T19:00:00'

/** Duration in minutes for calendar event */
export const eventDurationMinutes = 120

/** Weekend block for Apple Calendar (Fri evening → Sun midday) */
export const weekendEvent = {
  title: 'mangopookie weekend',
  startIso: '2026-06-12T17:00:00',
  endIso: '2026-06-14T12:00:00',
  location: 'San Diego, CA',
  details:
    'Weekend with Kaevon — Friday night + Saturday plans. boy mango mando has you.',
  fridayLabel: 'Friday, June 12, 2026',
  saturdayLabel: 'Saturday, June 13, 2026',
}

export const venues = [
  {
    id: 'seneca',
    name: 'Seneca Restaurant',
    tagline: 'Restaurant on the bay — 19th floor',
    address: '901 Bayfront Ct., FL 19, San Diego, CA 92101',
    phone: '(619) 877-8642',
    coordinates: { lat: 32.709, lng: -117.1685 },
    appleMapsUrl:
      'https://maps.apple.com/?address=901+Bayfront+Ct,+San+Diego,+CA+92101&q=Seneca+Restaurant',
    isDefault: true,
  },
  {
    id: 'surprise',
    name: 'Surprise me',
    tagline: 'Kaevon picks somewhere special in San Diego',
    address: 'San Diego, CA',
    phone: null,
    coordinates: { lat: 32.7157, lng: -117.1611 },
    appleMapsUrl: 'https://maps.apple.com/?q=San+Diego,+CA',
    isDefault: false,
  },
  {
    id: 'yacht-day',
    name: 'Euro summer yacht day',
    tagline: 'Sun on the water, San Diego bay',
    address: 'San Diego Bay, CA',
    phone: null,
    coordinates: { lat: 32.7157, lng: -117.175 },
    appleMapsUrl: 'https://maps.apple.com/?q=San+Diego+Bay,+CA',
    isDefault: false,
  },
]

export const confirmation = {
  title: (name) => `It is a date, ${name}.`,
  message:
    'I cannot wait. Thank you for saying yes. I will take care of the rest.',
  signOff: (name) => `With love,\n${name}`,
  calendarButton: 'Add to Apple Calendar',
  textMangoMando: 'Text mango mando',
  textMangoMandoHint: 'Send me a quick yes so I know you’re in',
  textMangoMandoBody:
    'ur the best ex boyfriend ever mando commando boy mango baby yoda bear i cant wait for our weekend thx sm',
  yourPicksLabel: 'Your picks',
  countdownToday: 'it’s mango weekend 🥭',
  countdownOneDay: '1 day until mangopookie weekend',
  countdownDays: (days) => `${days} days until mangopookie weekend`,
}

/**
 * Format datetime for display.
 */
export function formatEventDateTime(isoString) {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Los_Angeles',
  }).format(date)
}

function formatGoogleCalendarInstant(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
  )
}

/**
 * Parse ISO local datetime to Date parts for Google Calendar.
 */
function toGoogleCalendarDate(isoString, durationMinutes) {
  const start = new Date(isoString)
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000)
  return `${formatGoogleCalendarInstant(start)}/${formatGoogleCalendarInstant(end)}`
}

/**
 * Build Google Calendar event URL.
 */
export function buildGoogleCalendarUrl({ venue, dateTimeIso, durationMinutes = eventDurationMinutes }) {
  const title = encodeURIComponent(`Date night with ${recipient.name}`)
  const location = encodeURIComponent(venue.address)
  const details = encodeURIComponent(
    `Dinner at ${venue.name}.\n\nSee you there, ${recipient.name}.`,
  )
  const dates = encodeURIComponent(toGoogleCalendarDate(dateTimeIso, durationMinutes))

  return (
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${title}` +
    `&dates=${dates}` +
    `&details=${details}` +
    `&location=${location}` +
    `&ctz=America/Los_Angeles`
  )
}

const ICS_TIMEZONE = 'America/Los_Angeles'

function escapeIcsText(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

function formatIcsLocalFromIso(isoString) {
  const [datePart, timePart = '00:00:00'] = isoString.split('T')
  const [year, month, day] = datePart.split('-')
  const [hour, minute, second = '00'] = timePart.split(':')
  return `${year}${month}${day}T${hour}${minute}${second.split('.')[0]}`
}

function formatIcsUtc(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  )
}

/** ICS for the full mangopookie weekend (opens in Apple Calendar on iOS) */
export function buildWeekendCalendarIcs() {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//mangopookie//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:mangopookie-weekend-2026@kaevon',
    `DTSTAMP:${formatIcsUtc(new Date())}`,
    `DTSTART;TZID=${ICS_TIMEZONE}:${formatIcsLocalFromIso(weekendEvent.startIso)}`,
    `DTEND;TZID=${ICS_TIMEZONE}:${formatIcsLocalFromIso(weekendEvent.endIso)}`,
    `SUMMARY:${escapeIcsText(weekendEvent.title)}`,
    `DESCRIPTION:${escapeIcsText(weekendEvent.details)}`,
    `LOCATION:${escapeIcsText(weekendEvent.location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.join('\r\n')
}

/** Download weekend ICS — iOS opens Apple Calendar to add the event */
export function addWeekendToAppleCalendar() {
  const blob = new Blob([buildWeekendCalendarIcs()], {
    type: 'text/calendar;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'mangopookie-weekend.ics'
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

/** Opens iMessage to mango mando with celebration text + her itinerary picks */
export function buildMangoMandoSmsUrl({ fridayPicks = [], saturdayPicks = [] } = {}) {
  const lines = [
    confirmation.textMangoMandoBody,
    fridayPicks.length > 0 ? `Friday: ${fridayPicks.join(', ')}` : null,
    saturdayPicks.length > 0 ? `Saturday: ${saturdayPicks.join(', ')}` : null,
  ].filter(Boolean)
  const body = encodeURIComponent(lines.join('\n'))
  const digits = sender.phone?.replace(/\D/g, '')
  if (!digits) {
    return `sms:&body=${body}`
  }
  const normalized =
    digits.length === 10 ? `1${digits}` : digits.startsWith('1') ? digits : `1${digits}`
  return `sms:+${normalized}?body=${body}`
}

export function getDefaultVenue() {
  return venues.find((v) => v.isDefault) ?? venues[0]
}
