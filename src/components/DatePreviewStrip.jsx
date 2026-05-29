import { format } from 'date-fns'
import { CalendarBlank, Clock } from '@phosphor-icons/react'
import { parseLocalDateTime } from '../lib/datetime'

export function DatePreviewStrip({ dateTimeIso }) {
  const selected = parseLocalDateTime(dateTimeIso)
  const summaryDate = format(selected, 'EEEE, MMMM d')
  const summaryTime = format(selected, 'h:mm a')

  return (
    <div
      className="date-preview-strip flex shrink-0 items-center gap-3 border-t border-rose/10 bg-rose-soft/25 px-6 py-3 sm:hidden"
      aria-label={`Selected date: ${summaryDate} at ${summaryTime}`}
    >
      <CalendarBlank className="size-5 shrink-0 text-rose" weight="duotone" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-rose-deep">Date</p>
        <p className="truncate text-sm font-semibold text-ink">{summaryDate}</p>
        <p className="flex items-center gap-1.5 text-sm text-ink-muted">
          <Clock className="size-3.5 text-rose" weight="fill" aria-hidden />
          {summaryTime}
        </p>
      </div>
    </div>
  )
}
