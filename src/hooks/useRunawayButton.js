import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { useMotionValue, useSpring } from 'motion/react'

const DESKTOP = {
  detectionRadius: 120,
  fleeSpeed: 9.5,
  minUrgency: 0.45,
  maxStep: 12,
  returnSpeed: 0.12,
  shoveMultiplier: 5,
  pointerSmoothing: 1,
  pointerDeadzone: 0,
  tapRadius: 100,
  tapShove: 40,
  proximityFlee: true,
}

const TOUCH = {
  detectionRadius: 0,
  fleeSpeed: 0,
  minUrgency: 0,
  maxStep: 0,
  returnSpeed: 0.22,
  shoveMultiplier: 0,
  pointerSmoothing: 1,
  pointerDeadzone: 0,
  tapRadius: 52,
  tapShove: 26,
  proximityFlee: false,
}

const VIEWPORT_PADDING = 12
const TAUNT_COOLDOWN_MS = 900

function getPointerProfile() {
  if (typeof window === 'undefined') return DESKTOP
  return window.matchMedia('(pointer: coarse)').matches ? TOUCH : DESKTOP
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function distance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y2)
}

/**
 * Runaway No button — slot-anchored (scrolls with the CTA row).
 * Desktop: cursor proximity flee. Touch: only a small shove when tapping very close.
 */
export function useRunawayButton({ buttonRef, slotRef, layoutReady = true, disabled = false, onDodge }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const opacity = useMotionValue(0)
  const springOpacity = useSpring(opacity, { stiffness: 400, damping: 30 })

  const home = useRef({ width: 0, height: 0 })
  const offset = useRef({ x: 0, y: 0 })
  const pointer = useRef({ x: -9999, y: -9999 })
  const smoothPointer = useRef({ x: -9999, y: -9999 })
  const profileRef = useRef(DESKTOP)
  const ready = useRef(false)
  const rafId = useRef(null)
  const lastTauntAt = useRef(0)
  const wasThreatened = useRef(false)

  const getSlotCenter = useCallback(() => {
    const slot = slotRef?.current
    if (!slot) return { x: 0, y: 0 }

    const rect = slot.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2 + offset.current.x,
      y: rect.top + rect.height / 2 + offset.current.y,
    }
  }, [slotRef])

  const measureHome = useCallback(() => {
    const slot = slotRef?.current
    const button = buttonRef.current
    if (!slot || !button) return false

    const btnRect = button.getBoundingClientRect()
    home.current = {
      width: btnRect.width,
      height: btnRect.height,
    }

    if (!wasThreatened.current) {
      offset.current = { x: 0, y: 0 }
      x.set(0)
      y.set(0)
    }

    ready.current = layoutReady
    opacity.set(layoutReady ? 1 : 0)
    return layoutReady
  }, [buttonRef, layoutReady, opacity, slotRef, x, y])

  const clampOffsetToViewport = useCallback(() => {
    const slot = slotRef?.current
    if (!slot) return

    const slotRect = slot.getBoundingClientRect()
    const { width, height } = home.current
    const centerX = slotRect.left + slotRect.width / 2 + offset.current.x
    const centerY = slotRect.top + slotRect.height / 2 + offset.current.y

    const halfW = width / 2
    const halfH = height / 2
    const minCenterX = VIEWPORT_PADDING + halfW
    const maxCenterX = window.innerWidth - VIEWPORT_PADDING - halfW
    const minCenterY = VIEWPORT_PADDING + halfH
    const maxCenterY = window.innerHeight - VIEWPORT_PADDING - halfH

    const clampedX = clamp(centerX, minCenterX, maxCenterX)
    const clampedY = clamp(centerY, minCenterY, maxCenterY)

    offset.current.x += clampedX - centerX
    offset.current.y += clampedY - centerY
  }, [slotRef])

  const applyPosition = useCallback(() => {
    x.set(offset.current.x)
    y.set(offset.current.y)
  }, [x, y])

  const triggerTaunt = useCallback(() => {
    const now = Date.now()
    if (now - lastTauntAt.current > TAUNT_COOLDOWN_MS) {
      lastTauntAt.current = now
      onDodge?.()
    }
  }, [onDodge])

  const shoveAway = useCallback(
    (clientX, clientY, { isTap = false } = {}) => {
      if (!ready.current) return false

      const profile = profileRef.current
      const center = getSlotCenter()
      const dist = distance(clientX, clientY, center.x, center.y)
      const reach = isTap ? (profile.tapRadius ?? profile.detectionRadius) : profile.detectionRadius

      if (dist >= reach) return false

      const dx = center.x - clientX
      const dy = center.y - clientY
      const len = Math.hypot(dx, dy) || 1
      const shove = isTap
        ? (profile.tapShove ?? 32)
        : Math.min(profile.fleeSpeed * profile.shoveMultiplier, profile.maxStep * 2.5)

      offset.current.x += (dx / len) * shove
      offset.current.y += (dy / len) * shove
      clampOffsetToViewport()
      applyPosition()
      wasThreatened.current = true
      triggerTaunt()
      return true
    },
    [applyPosition, clampOffsetToViewport, getSlotCenter, triggerTaunt],
  )

  const step = useCallback(() => {
    if (!ready.current || disabled) return

    const profile = profileRef.current
    const center = getSlotCenter()
    const dist = distance(pointer.current.x, pointer.current.y, center.x, center.y)

    if (profile.proximityFlee && dist < profile.detectionRadius) {
      const proximity = (profile.detectionRadius - dist) / profile.detectionRadius
      const urgency = profile.minUrgency + (1 - profile.minUrgency) * proximity
      const dx = center.x - pointer.current.x
      const dy = center.y - pointer.current.y
      const len = Math.hypot(dx, dy) || 1
      const stepSize = Math.min(profile.fleeSpeed * urgency, profile.maxStep)

      offset.current.x += (dx / len) * stepSize
      offset.current.y += (dy / len) * stepSize
      clampOffsetToViewport()
      applyPosition()

      if (!wasThreatened.current) {
        wasThreatened.current = true
        triggerTaunt()
      }
    } else {
      wasThreatened.current = false
      offset.current.x *= 1 - profile.returnSpeed
      offset.current.y *= 1 - profile.returnSpeed

      if (Math.abs(offset.current.x) < 0.35) offset.current.x = 0
      if (Math.abs(offset.current.y) < 0.35) offset.current.y = 0

      applyPosition()
    }
  }, [applyPosition, clampOffsetToViewport, disabled, getSlotCenter, triggerTaunt])

  useLayoutEffect(() => {
    if (disabled) return

    measureHome()

    const slot = slotRef?.current
    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            if (!wasThreatened.current) measureHome()
          })
        : null

    if (slot) observer?.observe(slot)

    return () => observer?.disconnect()
  }, [disabled, layoutReady, measureHome, slotRef])

  useEffect(() => {
    if (disabled || !layoutReady) return

    let frame = 0
    let frames = 0
    const settle = () => {
      if (!wasThreatened.current) measureHome()
      frames += 1
      if (frames < 10) frame = requestAnimationFrame(settle)
    }
    frame = requestAnimationFrame(settle)

    return () => cancelAnimationFrame(frame)
  }, [disabled, layoutReady, measureHome])

  useEffect(() => {
    if (disabled) return

    profileRef.current = getPointerProfile()
    const isTouch = !profileRef.current.proximityFlee

    const onPointerMove = (clientX, clientY) => {
      pointer.current = { x: clientX, y: clientY }
      smoothPointer.current = { x: clientX, y: clientY }
    }

    const onMouseMove = (e) => onPointerMove(e.clientX, e.clientY)

    const onTouchStart = (e) => {
      const touch = e.touches[0]
      if (!touch) return
      shoveAway(touch.clientX, touch.clientY, { isTap: true })
    }

    const onResize = () => {
      if (!wasThreatened.current) measureHome()
    }

    if (!isTouch) {
      document.addEventListener('mousemove', onMouseMove, { passive: true })
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('resize', onResize)

    const loop = () => {
      step()
      rafId.current = requestAnimationFrame(loop)
    }
    rafId.current = requestAnimationFrame(loop)

    return () => {
      if (!isTouch) {
        document.removeEventListener('mousemove', onMouseMove)
      }
      document.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('resize', onResize)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [disabled, measureHome, shoveAway, step])

  const shoveFromPointer = useCallback(
    (clientX, clientY) => {
      shoveAway(clientX, clientY, { isTap: true })
    },
    [shoveAway],
  )

  const reset = useCallback(() => {
    offset.current = { x: 0, y: 0 }
    wasThreatened.current = false
    measureHome()
  }, [measureHome])

  return {
    x,
    y,
    opacity: springOpacity,
    shoveFromPointer,
    reset,
  }
}
