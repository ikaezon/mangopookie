import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { GameController } from '@phosphor-icons/react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useVisualViewportBottom } from '../hooks/useVisualViewportBottom'

export function FortniteQueueToast({ open, headline, status }) {
  const reducedMotion = useReducedMotion()
  const viewportBottom = useVisualViewportBottom()

  if (!open) return null

  const bottomOffset = `calc(4.75rem + 0.625rem + env(safe-area-inset-bottom, 0px) + ${viewportBottom}px)`

  return createPortal(
    <motion.div
      className="pointer-events-none fixed inset-x-0 z-[9999] flex justify-center px-gutter"
      style={{ bottom: bottomOffset }}
      initial={reducedMotion ? false : { opacity: 0, y: 16, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reducedMotion ? undefined : { opacity: 0, y: 10, scale: 0.97 }}
      transition={{
        type: 'spring',
        stiffness: 420,
        damping: 28,
        mass: 0.85,
      }}
      role="status"
      aria-live="polite"
      aria-label={`${headline} ${status}`}
    >
      <div
        className="fortnite-queue-card flex w-full max-w-[19.5rem] items-center gap-3 rounded-2xl border border-rose/35 px-3.5 py-3 shadow-[0_16px_40px_-10px_oklch(0.22_0.04_15_/_0.55)] backdrop-blur-md"
      >
        <motion.div
          className="flex size-11 shrink-0 items-center justify-center self-center rounded-xl bg-rose/25 ring-1 ring-inset ring-rose/40"
          animate={
            reducedMotion
              ? undefined
              : { scale: [1, 1.06, 1], rotate: [0, -4, 4, 0] }
          }
          transition={
            reducedMotion
              ? undefined
              : { duration: 0.55, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.35 }
          }
        >
          <GameController className="size-6 text-white" weight="duotone" aria-hidden />
        </motion.div>

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 py-0.5">
          <div className="flex items-center justify-between gap-3 leading-none">
            <p className="truncate text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white">
              {headline}
            </p>
            <p className="shrink-0 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-pool">
              {status}
              <span className="fortnite-queue-dots inline-flex w-[0.85rem] justify-start" aria-hidden>
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </p>
          </div>

          <div
            className="flex h-2 items-center gap-1"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext="Searching for duo"
          >
            {[0, 1, 2, 3].map((segment) => (
              <span
                key={segment}
                className={`fortnite-queue-segment h-full flex-1 rounded-full bg-gradient-to-r from-rose to-rose-glow ${
                  reducedMotion ? 'opacity-80' : ''
                }`}
                style={
                  reducedMotion
                    ? undefined
                    : { animationDelay: `${segment * 0.18}s` }
                }
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>,
    document.body,
  )
}
