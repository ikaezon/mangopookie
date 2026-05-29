import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useRunawayButton } from '../hooks/useRunawayButton'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { noButton } from '../config/content'

export function RunawayNoButton({ layoutReady = true, onTeaseLine }) {
  const slotRef = useRef(null)
  const buttonRef = useRef(null)
  const [teaseIndex, setTeaseIndex] = useState(-1)
  const dodgeCount = useRef(0)
  const reducedMotion = useReducedMotion()

  const handleDodge = useCallback(() => {
    dodgeCount.current += 1
    const lineIndex = Math.min(dodgeCount.current - 1, noButton.teasingLines.length - 1)
    setTeaseIndex(lineIndex)
  }, [])

  useEffect(() => {
    if (!onTeaseLine) return
    onTeaseLine(teaseIndex >= 0 ? noButton.teasingLines[teaseIndex] : null)
  }, [onTeaseLine, teaseIndex])

  const { x, y, opacity, shoveFromPointer } = useRunawayButton({
    buttonRef,
    slotRef,
    layoutReady,
    disabled: reducedMotion,
    onDodge: handleDodge,
  })

  const preventClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleNearTap = (e) => {
    preventClick(e)
    if (reducedMotion || e.pointerType === 'touch') return
    shoveFromPointer(e.clientX, e.clientY)
  }

  if (reducedMotion) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex h-[52px] items-center justify-center box-border min-w-[120px] cursor-default rounded-[var(--radius-pill)] border-2 border-rose/30 bg-surface px-8 text-base font-medium leading-none text-ink-muted opacity-60"
      >
        {noButton.label}
      </button>
    )
  }

  return (
    <div
      ref={slotRef}
      className="relative flex h-[52px] min-w-[120px] shrink-0 items-center justify-center self-center"
    >
      <motion.button
        ref={buttonRef}
        type="button"
        aria-label={noButton.label}
        tabIndex={-1}
        onClick={preventClick}
        onPointerDown={handleNearTap}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          x,
          y,
          opacity,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="inline-flex h-[52px] items-center justify-center box-border min-w-[120px] cursor-default select-none rounded-[var(--radius-pill)] border-2 border-rose/30 bg-surface px-8 text-base font-medium leading-none text-ink-muted shadow-sm touch-none max-sm:transform-gpu"
      >
        {noButton.label}
      </motion.button>
    </div>
  )
}
