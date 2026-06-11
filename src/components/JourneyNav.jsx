import { useRef } from 'react'
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'

export function JourneyNav({
  onBack,
  onNext,
  nextLabel = 'Next',
  showBack = true,
  showNext = true,
  backDisabled = false,
  nextDisabled = false,
  centerNext = false,
}) {
  const backPointerRef = useRef(false)

  const nextButtonClass =
    'btn-shimmer relative flex min-h-12 items-center justify-center gap-2 rounded-full bg-rose px-8 text-base font-semibold text-white shadow-[0_8px_24px_-6px_oklch(0.58_0.18_12_/_0.45)] transition-colors hover:bg-rose-deep disabled:pointer-events-none disabled:bg-ink-muted/35 disabled:text-white/70 disabled:shadow-none'

  const handleBackPointerDown = (e) => {
    if (backDisabled) return
    backPointerRef.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handleBackPointerUp = (e) => {
    if (!backPointerRef.current) return
    backPointerRef.current = false
    if (backDisabled) return
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    onBack()
  }

  const handleBackPointerCancel = () => {
    backPointerRef.current = false
  }

  if (centerNext && showNext && !showBack) {
    return (
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className={`${nextButtonClass} min-w-[min(100%,14rem)]`}
        >
          {nextLabel}
          <ArrowRight size={18} weight="bold" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      {showBack ? (
        <button
          type="button"
          onPointerDown={handleBackPointerDown}
          onPointerUp={handleBackPointerUp}
          onPointerCancel={handleBackPointerCancel}
          disabled={backDisabled}
          className="flex min-h-12 min-w-12 touch-manipulation items-center justify-center rounded-full border border-rose/25 bg-surface/80 text-rose-deep transition-colors hover:border-rose/40 hover:bg-rose-soft disabled:pointer-events-none disabled:opacity-35"
          aria-label="Back"
        >
          <ArrowLeft size={20} weight="bold" />
        </button>
      ) : (
        <div className="min-w-12 shrink-0" />
      )}

      {showNext ? (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className={`${nextButtonClass} flex-1 touch-manipulation`}
        >
          {nextLabel}
          <ArrowRight size={18} weight="bold" />
        </button>
      ) : null}
    </div>
  )
}
