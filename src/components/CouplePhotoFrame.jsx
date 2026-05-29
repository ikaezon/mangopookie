import { motion } from 'motion/react'
import { Heart } from '@phosphor-icons/react'
import { useReducedMotion } from '../hooks/useReducedMotion'

const PHOTO_SRC = '/couple-photo.png'

export function CouplePhotoFrame({ className = '', compact = false }) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: compact ? 20 : 32, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26, delay: compact ? 0.15 : 0.3 }}
      className={`relative ${className}`}
    >
      <div
        className={
          compact
            ? 'relative mx-auto aspect-[3/4] w-full max-w-[220px]'
            : 'relative aspect-[3/4] w-full max-w-md'
        }
      >
        {!reducedMotion && (
          <motion.div
            className="absolute -inset-[3px] rounded-[calc(var(--radius-card)+12px)] opacity-80"
            style={{
              background:
                'conic-gradient(from 0deg, oklch(0.72 0.14 12), oklch(0.58 0.18 12), oklch(0.94 0.04 12), oklch(0.72 0.14 12))',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            aria-hidden
          />
        )}

        <motion.div
          animate={reducedMotion ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative overflow-hidden rounded-[calc(var(--radius-card)+8px)] bg-surface shadow-[0_24px_60px_-12px_oklch(0.58_0.18_12_/_0.28)] ring-1 ring-rose/20"
        >
          <img
            src={PHOTO_SRC}
            alt="Kaevon and Taite"
            className="h-full w-full object-cover object-center"
            loading="eager"
            decoding="async"
          />

          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-rose-soft/10"
            aria-hidden
          />

          {!compact && (
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 22 }}
              className="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-[var(--radius-card)] border border-white/25 bg-white/15 px-4 py-3 backdrop-blur-md"
            >
              <Heart className="size-5 shrink-0 text-white" weight="fill" aria-hidden />
              <p className="text-pretty text-sm font-medium text-white">
                A night worth saying yes to.
              </p>
            </motion.div>
          )}
        </motion.div>

        {!reducedMotion && (
          <>
            <motion.span
              className="absolute -right-3 top-8 flex size-10 items-center justify-center rounded-full bg-rose-soft shadow-md ring-2 ring-surface"
              animate={{ scale: [1, 1.12, 1], rotate: [0, 8, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden
            >
              <Heart className="size-5 text-rose" weight="fill" />
            </motion.span>
            <motion.span
              className="absolute -left-2 bottom-16 flex size-8 items-center justify-center rounded-full bg-surface shadow-md ring-1 ring-rose/20"
              animate={{ scale: [1, 1.08, 1], y: [0, -4, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              aria-hidden
            >
              <Heart className="size-4 text-rose-glow" weight="duotone" />
            </motion.span>
          </>
        )}
      </div>
    </motion.div>
  )
}
