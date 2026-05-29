/**
 * Editable content and configuration for mangopookie date ask.
 * Update names, copy, venue, and default datetime here.
 */

export const sender = {
  name: 'Kaevon',
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

/** Default date: next Saturday 7:00 PM local (Pacific). Override ISO string as needed. */
export const defaultDateTime = '2026-05-30T19:00:00'

/** Duration in minutes for calendar event */
export const eventDurationMinutes = 120

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
  calendarButton: 'Add to Google Calendar',
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

/**
 * Parse ISO local datetime to Date parts for Google Calendar.
 */
function toGoogleCalendarDate(isoString, durationMinutes) {
  const start = new Date(isoString)
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000)

  const format = (d) => {
    const pad = (n) => String(n).padStart(2, '0')
    return (
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
      `T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
    )
  }

  return `${format(start)}/${format(end)}`
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

export function getDefaultVenue() {
  return venues.find((v) => v.isDefault) ?? venues[0]
}
