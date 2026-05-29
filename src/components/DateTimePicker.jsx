import { useMemo, useState } from 'react'
import { format, setHours, setMinutes } from 'date-fns'
import { CalendarBlank, Clock } from '@phosphor-icons/react'
import { CalendarPopover } from './CalendarPopover'
import { parseLocalDateTime, toLocalDateTimeIso } from '../lib/datetime'

const TIME_OPTIONS = [
  { id: '17:00', label: '5:00 PM', hours: 17, minutes: 0 },
  { id: '17:30', label: '5:30 PM', hours: 17, minutes: 30 },
  { id: '18:00', label: '6:00 PM', hours: 18, minutes: 0 },
  { id: '18:30', label: '6:30 PM', hours: 18, minutes: 30 },
  { id: '19:00', label: '7:00 PM', hours: 19, minutes: 0 },
  { id: '19:30', label: '7:30 PM', hours: 19, minutes: 30 },
  { id: '20:00', label: '8:00 PM', hours: 20, minutes: 0 },
  { id: '20:30', label: '8:30 PM', hours: 20, minutes: 30 },
  { id: '21:00', label: '9:00 PM', hours: 21, minutes: 0 },
]

function timeIdFromDate(date) {
  const id = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  return TIME_OPTIONS.some((t) => t.id === id) ? id : TIME_OPTIONS[4].id
}

function applyTime(date, timeId) {
  const slot = TIME_OPTIONS.find((t) => t.id === timeId) ?? TIME_OPTIONS[4]
  return setMinutes(setHours(date, slot.hours), slot.minutes)
}

export function DateTimePicker({ value, onChange, portalTarget, compactTimeRow = false }) {
  const selected = useMemo(() => parseLocalDateTime(value), [value])
  const timeId = timeIdFromDate(selected)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const summaryDate = format(selected, 'EEEE, MMMM d')
  const summaryTime = format(selected, 'h:mm a')

  const emit = (day, nextTimeId) => {
    onChange(toLocalDateTimeIso(applyTime(day, nextTimeId)))
  }

  return (
    <div className="date-time-picker space-y-4">
      <div>
        <span className="mb-2 block text-sm font-medium text-ink">Date</span>
        <button
          type="button"
          onClick={() => setCalendarOpen(true)}
          className="flex w-full min-h-[52px] items-center justify-between gap-3 rounded-[var(--radius-card)] border border-rose/20 bg-bg px-4 py-3 text-left transition-colors hover:border-rose/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
        >
          <span className="min-w-0">
            <span className="block text-base font-semibold text-ink">{summaryDate}</span>
            <span className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-muted">
              <Clock className="size-3.5 text-rose" weight="fill" aria-hidden />
              {summaryTime}
            </span>
          </span>
          <CalendarBlank className="size-5 shrink-0 text-rose" weight="duotone" aria-hidden />
        </button>
      </div>

      <CalendarPopover
        key={calendarOpen ? selected.toISOString() : 'calendar-closed'}
        open={calendarOpen}
        selected={selected}
        onSelect={(day) => emit(day, timeId)}
        onClose={() => setCalendarOpen(false)}
        portalTarget={portalTarget}
      />

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">Time</legend>
        <div
          className={
            compactTimeRow
              ? 'flex gap-2 overflow-x-auto overscroll-x-contain pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden'
              : 'grid grid-cols-3 gap-2'
          }
        >
          {TIME_OPTIONS.map((slot) => {
            const active = timeId === slot.id
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => emit(selected, slot.id)}
                aria-pressed={active}
                className={
                  active
                    ? `min-h-[42px] rounded-[var(--radius-pill)] bg-rose px-2 py-2 text-xs font-semibold text-white shadow-sm sm:text-sm${compactTimeRow ? ' max-sm:shrink-0' : ''}`
                    : `min-h-[42px] rounded-[var(--radius-pill)] border border-rose/20 bg-bg px-2 py-2 text-xs font-medium text-ink-muted transition-colors hover:border-rose/35 hover:text-ink sm:text-sm${compactTimeRow ? ' max-sm:shrink-0' : ''}`
                }
              >
                {slot.label}
              </button>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}
