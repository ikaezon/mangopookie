import { useCallback, useEffect, useRef } from 'react'
import { STORY_STEPS } from '../config/journey'

const NAV_COOLDOWN_MS = 450

/**
 * Guards step changes so rapid Back/Next taps cannot skip or reverse incorrectly.
 * Uses functional setStep + cooldown; pair with JourneyShell animation lock.
 */
export function useJourneyNavigation({
  step,
  setStep,
  fridaySelectedIds,
  saturdaySelectedIds,
  setSaturdaySelectedIds,
}) {
  const cooldownRef = useRef(false)
  const fridaySelectedRef = useRef(fridaySelectedIds)
  const saturdaySelectedRef = useRef(saturdaySelectedIds)

  useEffect(() => {
    fridaySelectedRef.current = fridaySelectedIds
  }, [fridaySelectedIds])

  useEffect(() => {
    saturdaySelectedRef.current = saturdaySelectedIds
  }, [saturdaySelectedIds])

  const tryNavigate = useCallback(
    (computeNext) => {
      if (cooldownRef.current) return false
      cooldownRef.current = true
      window.setTimeout(() => {
        cooldownRef.current = false
      }, NAV_COOLDOWN_MS)

      let changed = false
      setStep((current) => {
        const next = computeNext(current)
        if (next !== current) changed = true
        return next
      })
      return changed
    },
    [setStep],
  )

  const goBack = useCallback(
    (animationLocked = false) => {
      if (animationLocked) return
      tryNavigate((current) => {
        const idx = STORY_STEPS.indexOf(current)
        if (idx <= 0) return current
        return STORY_STEPS[idx - 1]
      })
    },
    [tryNavigate],
  )

  const goNext = useCallback(
    (animationLocked = false) => {
      if (animationLocked) return
      tryNavigate((current) => {
        const idx = STORY_STEPS.indexOf(current)
        if (idx < 0 || idx >= STORY_STEPS.length - 1) return current
        if (current === 'friday' && fridaySelectedRef.current.size === 0) {
          return current
        }
        if (current === 'saturday' && saturdaySelectedRef.current.size === 0) {
          return current
        }
        const nextStep = STORY_STEPS[idx + 1]
        if (nextStep === 'saturday') {
          setSaturdaySelectedIds(new Set())
        }
        return nextStep
      })
    },
    [tryNavigate, setSaturdaySelectedIds],
  )

  return { goBack, goNext, step, stepIndex: STORY_STEPS.indexOf(step) }
}
