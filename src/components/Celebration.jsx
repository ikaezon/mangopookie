import { motion } from 'motion/react'
import { Heart, CalendarPlus, ChatCircle } from '@phosphor-icons/react'
import { FloatingHearts } from './FloatingHearts'
import {
  confirmation,
  weekendEvent,
  addWeekendToAppleCalendar,
  buildMangoMandoSmsUrl,
  sender,
} from '../config/content'
import { useReducedMotion } from '../hooks/useReducedMotion'

function ConfettiPiece({ index, reducedMotion }) {
  const colors = ['#e8799a', '#f4a4b8', '#d64d72', '#ffb4c8']
  const left = `${(index * 17 + 11) % 100}%`
  const delay = (index % 8) * 0.08
  const size = 6 + (index % 4) * 2
  const rotate = (index * 47) % 360

  if (reducedMotion) return null

  return (
    <motion.span
      className="pointer-events-none absolute top-0 rounded-sm"
      style={{
        left,
        width: size,
        height: size * 1.4,
        backgroundColor: colors[index % colors.length],
      }}
      initial={{ y: -20, opacity: 0, rotate: 0 }}
      animate={{
        y: ['0vh', '110vh'],
        opacity: [0, 1, 1, 0],
        rotate: [0, rotate, rotate + 180],
        x: [0, (index % 2 === 0 ? 1 : -1) * (20 + (index % 5) * 12)],
      }}
      transition={{
        duration: 2.8 + (index % 5) * 0.3,
        delay,
        ease: 'easeOut',
        repeat: Infinity,
        repeatDelay: 1.2,
      }}
      aria-hidden
    />
  )
}

export function Celebration({
  recipientName,
  fridayPicks = [],
  saturdayPicks = [],
  onRestart,
}) {
  const reducedMotion = useReducedMotion()
  const smsUrl = buildMangoMandoSmsUrl()

  return (
    <motion.section
      initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="relative flex min-h-[100svh] min-h-[100dvh] flex-col items-center justify-center px-gutter py-16 safe-top safe-x"
      aria-labelledby="celebration-title"
    >
      <FloatingHearts />
      {!reducedMotion && (
        <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden>
          {Array.from({ length: 24 }, (_, i) => (
            <ConfettiPiece key={i} index={i} reducedMotion={reducedMotion} />
          ))}
        </div>
      )}

      <div className="relative z-10 w-full min-w-0 max-w-lg">
        <motion.div
          initial={reducedMotion ? false : { scale: 0 }}
          animate={
            reducedMotion
              ? { scale: 1 }
              : { scale: [1, 1.08, 1], rotate: [0, 4, -4, 0] }
          }
          transition={
            reducedMotion
              ? { type: 'spring', stiffness: 400, damping: 18, delay: 0.1 }
              : { scale: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 2.2, repeat: Infinity } }
          }
          className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-rose-soft shadow-[0_0_32px_oklch(0.58_0.18_12_/_0.35)]"
        >
          <Heart className="size-8 text-rose" weight="fill" aria-hidden />
        </motion.div>

        <h2
          id="celebration-title"
          className="text-balance text-center text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          {confirmation.title(recipientName)}
        </h2>

        <p className="text-pretty mt-4 text-center text-lg text-ink-muted">
          {confirmation.message}
        </p>

        <div className="mt-8 rounded-[var(--radius-card)] border border-rose/15 bg-surface p-5 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wide text-rose-deep">
            The plan
          </p>
          <p className="mt-2 text-lg font-semibold text-ink">
            {weekendEvent.title}
          </p>
          <p className="mt-1 text-ink-muted">{weekendEvent.fridayLabel}</p>
          <p className="text-ink-muted">{weekendEvent.saturdayLabel}</p>

          {(fridayPicks.length > 0 || saturdayPicks.length > 0) && (
            <div className="mt-4 space-y-2 border-t border-rose/10 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-deep">
                {confirmation.yourPicksLabel}
              </p>
              {fridayPicks.length > 0 && (
                <p className="text-sm text-ink-muted">
                  <span className="font-medium text-ink">Friday:</span>{' '}
                  {fridayPicks.join(' · ')}
                </p>
              )}
              {saturdayPicks.length > 0 && (
                <p className="text-sm text-ink-muted">
                  <span className="font-medium text-ink">Saturday:</span>{' '}
                  {saturdayPicks.join(' · ')}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={addWeekendToAppleCalendar}
            className="flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-[var(--radius-pill)] bg-rose px-6 py-3.5 text-base font-semibold text-white shadow-md transition-[background-color,transform,box-shadow] hover:bg-rose-deep hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose active:scale-[0.98]"
          >
            <CalendarPlus className="size-5" weight="bold" aria-hidden />
            {confirmation.calendarButton}
          </button>

          <a
            href={smsUrl}
            className="flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-[var(--radius-pill)] border-2 border-rose/25 bg-surface px-6 py-3.5 text-base font-semibold text-rose-deep shadow-sm transition-[background-color,transform,border-color] hover:border-rose/40 hover:bg-rose-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose active:scale-[0.98]"
          >
            <ChatCircle className="size-5" weight="bold" aria-hidden />
            {confirmation.textMangoMando}
          </a>
          <p className="text-center text-xs text-ink-muted">
            {confirmation.textMangoMandoHint}
          </p>
        </div>

        <p className="mt-10 whitespace-pre-line text-center text-base font-medium text-ink-muted">
          {confirmation.signOff(sender.name)}
        </p>

        {onRestart && (
          <button
            type="button"
            onClick={onRestart}
            className="mx-auto mt-6 block text-sm text-ink-muted underline-offset-4 hover:text-rose-deep hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
          >
            Start over
          </button>
        )}
      </div>
    </motion.section>
  )
}
