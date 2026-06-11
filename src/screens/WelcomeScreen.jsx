import { NicknameMarquee } from '../components/NicknameMarquee'
import { PolaroidCard } from '../components/PolaroidCard'
import { welcome } from '../config/journey'

const POLAROID_LAYERS = ['z-10', 'z-20', 'z-10']

export function WelcomeScreen() {
  return (
    <div className="relative z-[2] flex flex-col items-center gap-5 pt-2 text-center">
      <div className="w-full">
        <NicknameMarquee />
      </div>

      <div className="w-full space-y-3">
        <h1
          className="journey-display text-[clamp(2.25rem,6.5vw,3.5rem)] text-rose-vivid"
        >
          {welcome.headline}
        </h1>
        <p className="text-pretty text-base font-medium leading-snug text-ink-muted sm:text-lg">
          {welcome.subline}
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-center py-4 min-h-[min(44dvh,24rem)]">
        <div className="flex items-center justify-center -space-x-[4.25rem] sm:-space-x-10">
          {welcome.polaroids.map((polaroid, i) => (
            <PolaroidCard
              key={polaroid.src}
              src={polaroid.src}
              alt={polaroid.alt}
              caption={polaroid.caption}
              tilt={polaroid.tilt}
              size="welcome"
              delay={i * 0.06}
              className={POLAROID_LAYERS[i]}
            />
          ))}
        </div>
        <p className="mt-4 text-center text-xs font-medium tracking-wide text-ink-muted">
          {welcome.teaserCaption}
        </p>
      </div>
    </div>
  )
}
