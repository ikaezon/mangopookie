import { JourneySelectOption } from '../components/JourneySelectOption'
import { PolaroidCard } from '../components/PolaroidCard'
import { friday } from '../config/journey'

export function FridayScreen({ selectedIds, onSelectionChange }) {
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
  )
}
