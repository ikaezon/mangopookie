import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { DayPicker } from 'react-day-picker'
import { startOfDay } from 'date-fns'
import { motion, AnimatePresence } from 'motion/react'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function CalendarPopover({ open, selected, onSelect, onClose, portalTarget }) {
  const reducedMotion = useReducedMotion()
  const [month, setMonth] = useState(selected)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const today = startOfDay(new Date())

  if (!open || !portalTarget || typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="calendar-popover pointer-events-auto fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Choose a date"
            initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="calendar-popover-panel w-full max-w-[320px] rounded-[calc(var(--radius-card)+4px)] border border-rose/15 bg-surface p-4 shadow-[0_20px_50px_-12px_oklch(0.48_0.16_12_/_0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={(day) => {
                if (!day) return
                onSelect(day)
                onClose()
              }}
              month={month}
              onMonthChange={setMonth}
              disabled={{ before: today }}
              showOutsideDays
              className="date-picker-calendar mx-auto"
            />
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full min-h-[44px] rounded-[var(--radius-pill)] border border-rose/20 px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-rose/35 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
            >
              Done
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalTarget,
  )
}
