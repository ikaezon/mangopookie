import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FloatingHearts } from '../components/FloatingHearts'
import { JourneyNav } from '../components/JourneyNav'
import { STORY_STEPS } from '../config/journey'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useVisualViewportBottom } from '../hooks/useVisualViewportBottom'

export function JourneyShell({
  stepKey,
  renderStep,
  onBack,
  onNext,
  nextLabel = 'Next',
  showNav = true,
  showBack = true,
  showNext = true,
  backDisabled = false,
  nextDisabled = false,
  centerNext = false,
  mainScrollable = true,
  footer,
}) {
  const reducedMotion = useReducedMotion()
  const viewportBottom = useVisualViewportBottom()
  const [isAnimating, setIsAnimating] = useState(false)
  const prevStepKeyRef = useRef(null)
  const stepIndex = STORY_STEPS.indexOf(stepKey)

  // Lock nav on step changes only (not initial mount — no enter animation then)
  useEffect(() => {
    if (prevStepKeyRef.current === null) {
      prevStepKeyRef.current = stepKey
      setIsAnimating(false)
      return undefined
    }
    if (prevStepKeyRef.current === stepKey) return undefined

    prevStepKeyRef.current = stepKey
    setIsAnimating(true)

    const fallbackMs = reducedMotion ? 80 : 450
    const timer = window.setTimeout(() => setIsAnimating(false), fallbackMs)
    return () => window.clearTimeout(timer)
  }, [stepKey, reducedMotion])
  const progress = stepIndex >= 0 ? (stepIndex + 1) / STORY_STEPS.length : 0

  const transition = reducedMotion
    ? { duration: 0.15 }
    : { duration: 0.36, ease: 'easeOut' }

  const footerPaddingBottom = `max(0.625rem, env(safe-area-inset-bottom, 0px), ${viewportBottom}px)`

  const navLocked = isAnimating

  const handleBack = useCallback(() => {
    onBack(navLocked)
  }, [onBack, navLocked])

  const handleNext = useCallback(() => {
    onNext(navLocked)
  }, [onNext, navLocked])

  return (
    <div
      className="journey-viewport relative grid grid-rows-[auto_minmax(0,1fr)_auto] safe-top"
    >
      <FloatingHearts />

      <header className="relative z-[2] shrink-0 px-gutter pt-2 pb-1">
        <div className="h-1 overflow-hidden rounded-full bg-rose-soft">
          <div
            className="h-full rounded-full bg-rose transition-[width] duration-500 ease-out"
            style={{ width: `${progress * 100}%` }}
            role="progressbar"
            aria-valuenow={stepIndex + 1}
            aria-valuemin={1}
            aria-valuemax={STORY_STEPS.length}
            aria-label={`Step ${stepIndex + 1} of ${STORY_STEPS.length}`}
          />
        </div>
        <p className="mt-1.5 text-xs font-medium text-ink-muted">
          {stepIndex + 1} of {STORY_STEPS.length}
        </p>
      </header>

      <main
        className={`relative z-[2] min-h-0 px-gutter py-1 ${
          mainScrollable ? 'overflow-y-auto overscroll-contain' : 'overflow-hidden'
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stepKey}
            className="h-full min-h-0"
            initial={reducedMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, x: -24 }}
            transition={transition}
            onAnimationComplete={() => setIsAnimating(false)}
          >
            {renderStep(stepKey)}
          </motion.div>
        </AnimatePresence>
      </main>

      {(showNav || footer) && (
        <footer
          className="relative z-[2] shrink-0 px-gutter pt-2"
          style={{ paddingBottom: footerPaddingBottom }}
        >
          {footer ?? (
            <JourneyNav
              onBack={handleBack}
              onNext={handleNext}
              nextLabel={nextLabel}
              showBack={showBack}
              showNext={showNext}
              backDisabled={backDisabled || navLocked}
              nextDisabled={nextDisabled || navLocked}
              centerNext={centerNext}
            />
          )}
        </footer>
      )}
    </div>
  )
}
