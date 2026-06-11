import { PolaroidCard } from '../components/PolaroidCard'
import { ready } from '../config/journey'

export function ReadyScreen() {
  return (
    <div className="flex flex-col items-center py-6 text-center sm:py-10">
      <p
        className="journey-display text-[clamp(2.75rem,9vw,4rem)] text-rose-deep"
      >
        {ready.line}
      </p>

      <div className="mt-6 flex justify-center">
        <PolaroidCard
          src={ready.polaroid.src}
          alt={ready.polaroid.alt}
          caption={ready.polaroid.caption}
          tilt={ready.polaroid.tilt}
          size="sm"
        />
      </div>

      <div className="mt-6 flex gap-2" aria-hidden>
        <span className="h-1 w-8 rounded-full bg-stripe/60" />
        <span className="h-1 w-8 rounded-full bg-pool/50" />
        <span className="h-1 w-8 rounded-full bg-sage/50" />
      </div>
    </div>
  )
}
