import { useCallback, useEffect, useRef, useState } from 'react'
import { NoButtonTease } from './NoButtonTease'
import { motion } from 'motion/react'
import { Sparkle } from '@phosphor-icons/react'
import { RunawayNoButton } from './RunawayNoButton'
import { FloatingHearts } from './FloatingHearts'
import { CouplePhotoFrame } from './CouplePhotoFrame'
import { hero, yesButton } from '../config/content'
import { useReducedMotion } from '../hooks/useReducedMotion'

const stagger = {
  hidden: { opacity: 0, y: 22 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 26,
      delay: i * 0.08,
    },
  }),
}

function BackgroundMesh({ reducedMotion }) {
  const blobProps = reducedMotion
    ? {}
    : {
        animate: true,
      }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -right-[20%] top-[10%] h-[55vh] w-[55vh] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, oklch(0.88 0.08 12) 0%, transparent 70%)' }}
        {...(blobProps.animate
          ? {
              animate: { opacity: [0.45, 0.65, 0.45], scale: [1, 1.06, 1] },
              transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
            }
          : { style: { opacity: 0.55 } })}
      />
      <motion.div
        className="absolute -left-[15%] bottom-[5%] h-[45vh] w-[45vh] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, oklch(0.92 0.04 250) 0%, transparent 70%)' }}
        {...(blobProps.animate
          ? {
              animate: { opacity: [0.3, 0.5, 0.3], x: [0, 12, 0] },
              transition: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
            }
          : { style: { opacity: 0.4 } })}
      />
      <motion.div
        className="absolute right-[10%] bottom-[20%] h-[30vh] w-[30vh] rounded-full blur-2xl"
        style={{ background: 'radial-gradient(circle, oklch(0.85 0.1 12) 0%, transparent 65%)' }}
        {...(blobProps.animate
          ? {
              animate: { opacity: [0.2, 0.4, 0.2], y: [0, -16, 0] },
              transition: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 },
            }
          : { style: { opacity: 0.3 } })}
      />
    </div>
  )
}

function DecorativePanel() {
  return (
    <div className="relative hidden lg:flex lg:items-center lg:justify-center">
      <CouplePhotoFrame />
    </div>
  )
}

function EurosummerMarquee({ reducedMotion }) {
  const phrase = `${hero.subtextMarquee}${hero.subtextMarquee}`

  return (
    <motion.div
      custom={3}
      variants={stagger}
      initial="hidden"
      animate="show"
      className="relative mt-6 max-w-md overflow-hidden"
    >
      <div
        className={
          reducedMotion
            ? 'text-lg leading-relaxed text-ink-muted'
            : 'eurosummer-marquee flex w-max text-lg leading-relaxed text-ink-muted'
        }
        aria-hidden={!reducedMotion}
      >
        {reducedMotion ? (
          <span>{hero.subtextMarquee.trim()}</span>
        ) : (
          <>
            <span className="shrink-0 pr-8">{phrase}</span>
            <span className="shrink-0 pr-8">{phrase}</span>
          </>
        )}
      </div>
      {!reducedMotion && <p className="sr-only">{hero.subtextMarquee.trim()}</p>}
    </motion.div>
  )
}

export function Hero({ onYes }) {
  const yesRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const [ctaLayoutReady, setCtaLayoutReady] = useState(false)
  const [noTeaseLine, setNoTeaseLine] = useState(null)

  const handleCtaAnimationComplete = useCallback(() => {
    setCtaLayoutReady(true)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const fallback = window.setTimeout(() => setCtaLayoutReady(true), 950)
    return () => window.clearTimeout(fallback)
  }, [reducedMotion])

  return (
    <section
      className="relative flex min-h-[100svh] min-h-[100dvh] flex-col overflow-x-hidden bg-bg safe-top safe-x"
      aria-labelledby="hero-headline"
    >
      <BackgroundMesh reducedMotion={reducedMotion} />
      <FloatingHearts />

      <div className="relative z-10 mx-auto flex w-full min-w-0 max-w-6xl flex-1 flex-col justify-center px-gutter py-12 pb-[max(3rem,env(safe-area-inset-bottom,0px))] lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:px-10 lg:py-16">
        <motion.div
          initial="hidden"
          animate="show"
          className="flex flex-col"
        >
          <motion.p
            custom={0}
            variants={stagger}
            className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-rose-deep"
          >
            {!reducedMotion && (
              <motion.span
                animate={{ rotate: [0, 12, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkle className="size-4 text-rose-glow" weight="fill" aria-hidden />
              </motion.span>
            )}
            {hero.eyebrow}
          </motion.p>

          <div className="hero-type">
            <motion.h1
              id="hero-headline"
              custom={1}
              variants={stagger}
              className="hero-greeting"
            >
              {hero.headline()}
            </motion.h1>

            <motion.p
              custom={2}
              variants={stagger}
              className="hero-question mt-4 pb-1"
            >
              {hero.question}
            </motion.p>
          </div>

          <EurosummerMarquee reducedMotion={reducedMotion} />

          <div className="mt-8 lg:hidden">
            <CouplePhotoFrame compact />
          </div>

          <motion.div
            custom={4}
            variants={stagger}
            onAnimationComplete={handleCtaAnimationComplete}
            className="relative z-20 mt-10 flex w-full flex-col items-center sm:items-start"
          >
            <div className="flex w-full justify-center sm:hidden">
              <NoButtonTease line={noTeaseLine} placement="inline" />
            </div>
            <div className="hidden sm:block">
              <NoButtonTease line={noTeaseLine} placement="fixed" />
            </div>
            <div className="flex min-h-[52px] items-center justify-center gap-4 sm:justify-start sm:gap-6">
              <motion.button
                ref={yesRef}
                type="button"
                onClick={onYes}
                whileHover={reducedMotion ? undefined : { scale: 1.04 }}
                whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                className="btn-shimmer relative z-10 inline-flex h-[52px] shrink-0 items-center justify-center box-border min-w-[140px] overflow-hidden rounded-[var(--radius-pill)] border-2 border-transparent bg-rose px-10 text-base font-semibold leading-none text-white shadow-[0_8px_28px_-6px_oklch(0.58_0.18_12_/_0.55)] transition-shadow hover:bg-rose-deep hover:shadow-[0_12px_36px_-4px_oklch(0.48_0.16_12_/_0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
              >
                {yesButton.label}
              </motion.button>

              {!reducedMotion && (
                <RunawayNoButton layoutReady={ctaLayoutReady} onTeaseLine={setNoTeaseLine} />
              )}
            </div>
          </motion.div>
        </motion.div>

        <DecorativePanel />
      </div>
    </section>
  )
}
