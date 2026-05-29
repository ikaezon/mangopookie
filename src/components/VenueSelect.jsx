import { useEffect, useId, useRef, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'

export function VenueSelect({ venues, value, onChange, disabled = false }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const listId = useId()
  const selected = venues.find((v) => v.id === value) ?? venues[0]

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (disabled) setOpen(false)
  }, [disabled])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id="venue-select"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className="mt-2 flex w-full min-h-[52px] items-center justify-between gap-3 rounded-[var(--radius-card)] border border-rose/20 bg-bg px-4 py-3 text-left text-base text-ink transition-colors hover:border-rose/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose disabled:cursor-default disabled:opacity-70"
      >
        <span className="font-medium">{selected.name}</span>
        <CaretDown
          className={`size-5 shrink-0 text-rose transition-transform ${open ? 'rotate-180' : ''}`}
          weight="bold"
          aria-hidden
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Where"
          className="absolute z-20 mt-1 max-h-[min(14rem,40dvh)] w-full overflow-y-auto overscroll-contain rounded-[var(--radius-card)] border border-rose/15 bg-surface py-1 shadow-[0_12px_40px_-8px_oklch(0.48_0.16_12_/_0.28)]"
        >
          {venues.map((venue) => {
            const isSelected = venue.id === value
            return (
              <li key={venue.id} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(venue.id)
                    setOpen(false)
                  }}
                  className={
                    isSelected
                      ? 'flex w-full px-4 py-3 text-left text-base font-semibold text-rose'
                      : 'flex w-full px-4 py-3 text-left text-base text-ink transition-colors hover:bg-rose-soft/50'
                  }
                >
                  {venue.name}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
