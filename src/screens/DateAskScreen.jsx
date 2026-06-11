import { PolaroidCard } from '../components/PolaroidCard'
import { dateAsk } from '../config/journey'

const TILTS = [-6, 4, -3, 5, -5, 3, -4, 6]

export function DateAskScreen() {
  const polaroids = dateAsk.polaroids
  const rowSize = Math.ceil(polaroids.length / 2)
  const topRow = polaroids.slice(0, rowSize)
  const bottomRow = polaroids.slice(rowSize)

  return (
    <div className="flex flex-col items-center gap-5 pt-2 text-center">
      <div className="w-full space-y-3">
        <h2
          className="journey-display text-[clamp(1.85rem,5.5vw,2.75rem)] text-rose-vivid"
        >
          {dateAsk.headline}
        </h2>
        <p className="text-pretty text-base text-ink-muted sm:text-lg">
          {dateAsk.subline}
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-3 py-3 sm:gap-4">
        <div className="flex items-end justify-center -space-x-7 sm:-space-x-5">
          {topRow.map((polaroid, i) => (
            <PolaroidCard
              key={`${polaroid.caption}-top-${i}`}
              src={polaroid.src}
              alt={polaroid.alt}
              caption={polaroid.caption}
              tilt={polaroid.tilt ?? TILTS[i % TILTS.length]}
              size="collage"
              delay={i * 0.04}
              className={i % 2 === 0 ? 'z-10' : 'z-20'}
            />
          ))}
        </div>
        <div className="flex items-end justify-center -space-x-7 sm:-space-x-5">
          {bottomRow.map((polaroid, i) => (
            <PolaroidCard
              key={`${polaroid.caption}-bottom-${i}`}
              src={polaroid.src}
              alt={polaroid.alt}
              caption={polaroid.caption}
              tilt={polaroid.tilt ?? TILTS[(i + rowSize) % TILTS.length]}
              size="collage"
              delay={(i + rowSize) * 0.04}
              className={i % 2 === 0 ? 'z-10 translate-y-1' : 'z-20'}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
