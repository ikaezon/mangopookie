import { JourneySelectOption } from '../components/JourneySelectOption'
import { PolaroidCard } from '../components/PolaroidCard'
import { saturday } from '../config/journey'

export function SaturdayScreen({
  selectedIds = new Set(),
  onSelectionChange,
}) {
  const toggleActivity = (id) => {
    onSelectionChange((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="flex flex-col gap-5 pt-1">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-rose-glow">
          {saturday.dayLabel} · {saturday.dateLabel}
        </p>
      </header>

      <div className="space-y-2">
        <p className="text-sm font-medium text-ink-muted">
          {saturday.activitiesPrompt}
        </p>
        <ul className="space-y-2.5" aria-label="Saturday plans">
          {saturday.activities.map((activity, i) => (
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
        {saturday.polaroids.map((polaroid, i) => (
          <PolaroidCard
            key={polaroid.caption}
            src={polaroid.src}
            alt={polaroid.alt}
            caption={polaroid.caption}
            tilt={polaroid.tilt}
            size="sm"
            delay={i * 0.06}
          />
        ))}
      </div>
    </div>
  )
}
