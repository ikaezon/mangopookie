import { NicknameMarquee } from '../components/NicknameMarquee'
import { PolaroidCard } from '../components/PolaroidCard'
import { welcome } from '../config/journey'

const [topPolaroid, ...bottomPolaroids] = welcome.polaroids

export function WelcomeScreen() {
  return (
    <div className="relative z-[2] flex h-full min-h-0 flex-col items-center gap-2 pt-0 text-center">
      <div className="w-full shrink-0">
        <NicknameMarquee />
      </div>

      <div className="w-full shrink-0 space-y-1">
        <h1
          className="journey-display text-[clamp(1.65rem,4.8vw,2.35rem)] leading-[1.05] text-rose-vivid"
        >
          {welcome.headline}
        </h1>
        <p className="text-pretty text-sm font-medium leading-snug text-ink-muted">
          {welcome.subline}
        </p>
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center py-1">
        <div className="relative flex flex-col items-center">
          <PolaroidCard
            src={topPolaroid.src}
            alt={topPolaroid.alt}
            caption={topPolaroid.caption}
            tilt={topPolaroid.tilt}
            size="welcomeTop"
            delay={0}
            className="z-10"
          />
          <div
            className="relative z-20 flex items-end justify-center -mt-10 gap-2 sm:-mt-12 sm:gap-3"
          >
            {bottomPolaroids.map((polaroid, i) => (
              <PolaroidCard
                key={polaroid.src}
                src={polaroid.src}
                alt={polaroid.alt}
                caption={polaroid.caption}
                tilt={polaroid.tilt}
                size="welcomeBottom"
                delay={0.06 + i * 0.06}
                className={i === 0 ? 'z-10' : 'z-20'}
              />
            ))}
          </div>
        </div>
        <p className="mt-2 shrink-0 text-center text-[0.65rem] font-medium tracking-wide text-ink-muted">
          {welcome.teaserCaption}
        </p>
      </div>
    </div>
  )
}
