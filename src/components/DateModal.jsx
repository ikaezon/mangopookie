import { useState, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { MapPreview } from './MapPreview'
import { DateTimePicker } from './DateTimePicker'
import { VenueSelect } from './VenueSelect'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function DateModal({ open, onClose, onConfirm, venues, defaultVenueId, defaultDateTime }) {
  const dialogRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const [selectedVenueId, setSelectedVenueId] = useState(defaultVenueId)
  const [dateTime, setDateTime] = useState(defaultDateTime)
  const [calendarPortalEl, setCalendarPortalEl] = useState(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      setSelectedVenueId(defaultVenueId)
      setDateTime(defaultDateTime)
      requestAnimationFrame(() => {
        const active = document.activeElement
        if (active && active !== document.body && dialog.contains(active)) {
          active.blur()
        }
      })
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open, defaultVenueId, defaultDateTime])

  const selectedVenue = venues.find((v) => v.id === selectedVenueId) ?? venues[0]

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onConfirm({ venue: selectedVenue, dateTimeIso: dateTime })
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="date-modal-dialog backdrop:bg-ink/40"
      aria-labelledby="date-modal-title"
    >
      <div
        ref={setCalendarPortalEl}
        className="calendar-portal-mount pointer-events-none fixed inset-0 z-[9998]"
        aria-hidden
      />
      <div className="date-modal-dialog__center pointer-events-none flex min-h-[100dvh] w-full items-center justify-center safe-top safe-bottom">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 360, damping: 30 }}
          className="date-modal-panel pointer-events-auto flex h-full max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-[calc(var(--radius-card)+4px)] border border-rose/15 bg-surface shadow-[0_24px_60px_-16px_oklch(0.58_0.18_12_/_0.25)]"
          onClick={(e) => e.stopPropagation()}
        >
        <header className="shrink-0 border-b border-rose/10 px-6 py-4 max-sm:py-3.5">
          <h2 id="date-modal-title" className="text-balance text-xl font-semibold text-ink sm:text-2xl">
            Let us make it official
          </h2>
          <p className="text-pretty mt-1.5 text-sm text-ink-muted sm:text-base">
            Pick where we are going. I will handle the rest.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="date-modal-body space-y-5 overflow-y-auto overscroll-contain px-6 py-5">
            <div>
              <label htmlFor="venue-select" className="block text-sm font-medium text-ink">
                Where
              </label>
              <VenueSelect
                venues={venues}
                value={selectedVenueId}
                onChange={setSelectedVenueId}
              />
              <p className="mt-1.5 text-sm text-ink-muted">{selectedVenue.tagline}</p>
            </div>

            {selectedVenue.id === 'seneca' && (
              <MapPreview key={open ? 'map-open' : 'map-closed'} venue={selectedVenue} compact />
            )}

            <div>
              <DateTimePicker
                key={`${open}-${defaultDateTime}`}
                value={dateTime}
                onChange={setDateTime}
                portalTarget={calendarPortalEl}
              />
            </div>
          </div>

          <footer className="shrink-0 border-t border-rose/10 px-6 py-4">
            <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[48px] rounded-[var(--radius-pill)] px-6 py-2.5 text-base font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
              >
                Back
              </button>
              <button
                type="submit"
                className="min-h-[48px] rounded-[var(--radius-pill)] bg-rose px-8 py-2.5 text-base font-semibold text-white shadow-md transition-[background-color,transform] hover:bg-rose-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose active:scale-[0.98]"
              >
                Confirm the date
              </button>
            </div>
          </footer>
        </form>
        </motion.div>
      </div>
    </dialog>
  )
}
