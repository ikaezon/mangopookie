import { useCallback, useEffect, useRef, useState } from 'react'
import { JourneySelectOption } from '../components/JourneySelectOption'
import { PolaroidCard } from '../components/PolaroidCard'
import { FortniteQueueToast } from '../components/FortniteQueueToast'
import { friday } from '../config/journey'

const FORTNITE_ID = 'fortnite'
const TOAST_MS = 3400

export function FridayScreen({ selectedIds, onSelectionChange }) {
  const [fortniteToastOpen, setFortniteToastOpen] = useState(false)
  const toastTimerRef = useRef(null)

  const clearToastTimer = useCallback(() => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current)
      toastTimerRef.current = null
    }
  }, [])

  useEffect(() => () => clearToastTimer(), [clearToastTimer])

  const showFortniteToast = useCallback(() => {
    clearToastTimer()
    setFortniteToastOpen(true)
    toastTimerRef.current = window.setTimeout(() => {
      setFortniteToastOpen(false)
      toastTimerRef.current = null
    }, TOAST_MS)
  }, [clearToastTimer])

  const toggleActivity = (id) => {
    onSelectionChange((prev) => {
      const wasSelected = prev.has(id)
      const next = new Set(prev)
      if (wasSelected) {
        next.delete(id)
      } else {
        next.add(id)
        if (id === FORTNITE_ID) {
          showFortniteToast()
        }
      }
      return next
    })
  }

  return (
    <>
      <div className="flex flex-col gap-5 pt-1">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rose-glow">
            {friday.dayLabel} · {friday.dateLabel}
          </p>
          <h2
            className="journey-display text-[clamp(1.75rem,5.5vw,2.5rem)] text-rose-vivid"
          >
            {friday.title}
          </h2>
        </header>

        <div className="space-y-2">
          <p className="text-sm font-medium text-ink-muted">
            {friday.activitiesPrompt}
          </p>
          <ul className="space-y-2.5" aria-label="Friday night plans">
            {friday.activities.map((activity, i) => (
              <JourneySelectOption
                key={activity.id}
                option={activity}
                selected={selectedIds.has(activity.id)}
                onToggle={toggleActivity}
                index={i}
              />
            ))}
          </ul>
        </div>

        <div className="flex justify-center gap-4 pt-2">
          {friday.polaroids.map((polaroid, i) => (
            <PolaroidCard
              key={polaroid.caption}
              src={polaroid.src}
              alt={polaroid.alt}
              caption={polaroid.caption}
              tilt={polaroid.tilt}
              size="sm"
              delay={0.08 + i * 0.06}
            />
          ))}
        </div>
      </div>

      <FortniteQueueToast
        open={fortniteToastOpen}
        headline={friday.fortniteToast.headline}
        status={friday.fortniteToast.status}
      />
    </>
  )
}
