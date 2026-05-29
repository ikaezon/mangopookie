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
}

const TOUCH = {
  detectionRadius: 96,
  tapRadius: 120,
  fleeSpeed: 5.2,
  minUrgency: 0.28,
  maxStep: 6,
  returnSpeed: 0.18,
  shoveMultiplier: 3,
  tapShove: 48,
  pointerSmoothing: 0.28,
  pointerDeadzone: 4,
}

const VIEWPORT_PADDING = 16
const TAUNT_COOLDOWN_MS = 900

function getPointerProfile() {
  if (typeof window === 'undefined') return DESKTOP
  return window.matchMedia('(pointer: coarse)').matches ? TOUCH : DESKTOP
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function distance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1)
}

/**
 * Proximity-based runaway button (inspired by evasive-button / button-will-react):
 * - Rests beside Yes at a measured home position
 * - Only moves when the cursor enters DETECTION_RADIUS
 * - Springs back home when the cursor leaves
 */
export function useRunawayButton({ buttonRef, slotRef, alignRef, layoutReady = true, disabled = false, onDodge }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const opacity = useMotionValue(0)
  const springOpacity = useSpring(opacity, { stiffness: 400, damping: 30 })

  const home = useRef({ left: 0, top: 0, width: 0, height: 0 })
  const offset = useRef({ x: 0, y: 0 })
  const pointer = useRef({ x: -9999, y: -9999 })
  const smoothPointer = useRef({ x: -9999, y: -9999 })
  const profileRef = useRef(DESKTOP)
  const ready = useRef(false)
  const rafId = useRef(null)
  const lastTauntAt = useRef(0)
  const wasThreatened = useRef(false)
  const touchClearTimer = useRef(null)

  const measureHome = useCallback(() => {
    const slot = slotRef?.current
    const button = buttonRef.current
    if (!slot || !button) return false

    const slotRect = slot.getBoundingClientRect()
    const btnRect = button.getBoundingClientRect()
    const alignRect = alignRef?.current?.getBoundingClientRect()

    home.current = {
      left: slotRect.left + (slotRect.width - btnRect.width) / 2,
      top: alignRect
        ? alignRect.top + (alignRect.height - btnRect.height) / 2
        : slotRect.top + (slotRect.height - btnRect.height) / 2,
      width: btnRect.width,
      height: btnRect.height,
    }

    if (!wasThreatened.current) {
      offset.current = { x: 0, y: 0 }
      x.set(home.current.left)
      y.set(home.current.top)
    }

    ready.current = layoutReady
    opacity.set(layoutReady ? 1 : 0)
    return layoutReady
  }, [alignRef, buttonRef, layoutReady, opacity, slotRef, x, y])

  const clampOffsetToViewport = useCallback(() => {
    const { left: homeLeft, top: homeTop, width, height } = home.current
    const vw = window.innerWidth
    const vh = window.innerHeight

    const maxOffsetX = vw - width - VIEWPORT_PADDING - homeLeft
    const minOffsetX = VIEWPORT_PADDING - homeLeft
    const maxOffsetY = vh - height - VIEWPORT_PADDING - homeTop
    const minOffsetY = VIEWPORT_PADDING - homeTop

    offset.current.x = clamp(offset.current.x, minOffsetX, maxOffsetX)
    offset.current.y = clamp(offset.current.y, minOffsetY, maxOffsetY)
  }, [])

  const applyPosition = useCallback(() => {
    x.set(home.current.left + offset.current.x)
    y.set(home.current.top + offset.current.y)
  }, [x, y])

  const getButtonCenter = useCallback(() => {
    const { width, height } = home.current
    return {
      x: home.current.left + offset.current.x + width / 2,
      y: home.current.top + offset.current.y + height / 2,
    }
  }, [])

  const shoveAway = useCallback(
    (clientX, clientY, { isTap = false } = {}) => {
      if (!ready.current) return false

      const profile = profileRef.current
      const center = getButtonCenter()
      const dist = distance(clientX, clientY, center.x, center.y)
      const reach = isTap ? (profile.tapRadius ?? profile.detectionRadius) : profile.detectionRadius

      if (dist >= reach) return false

      pointer.current = { x: clientX, y: clientY }
      smoothPointer.current = { x: clientX, y: clientY }

      const dx = center.x - clientX
      const dy = center.y - clientY
      const len = Math.hypot(dx, dy) || 1
      const shove = isTap
        ? (profile.tapShove ?? 40)
        : Math.min(profile.fleeSpeed * profile.shoveMultiplier, profile.maxStep * 2.5)

      offset.current.x += (dx / len) * shove
      offset.current.y += (dy / len) * shove
      clampOffsetToViewport()
      applyPosition()
      wasThreatened.current = true

      const now = Date.now()
      if (now - lastTauntAt.current > TAUNT_COOLDOWN_MS) {
        lastTauntAt.current = now
        onDodge?.()
      }

      return true
    },
    [applyPosition, clampOffsetToViewport, getButtonCenter, onDodge],
  )

  const step = useCallback(() => {
    if (!ready.current || disabled) return

    const button = buttonRef.current
    if (!button) return

    const profile = profileRef.current
    const { width, height } = home.current
    const centerX = home.current.left + offset.current.x + width / 2
    const centerY = home.current.top + offset.current.y + height / 2
    const dist = distance(pointer.current.x, pointer.current.y, centerX, centerY)

    if (dist < profile.detectionRadius) {
      const proximity = (profile.detectionRadius - dist) / profile.detectionRadius
      const urgency = profile.minUrgency + (1 - profile.minUrgency) * proximity
      const dx = centerX - pointer.current.x
      const dy = centerY - pointer.current.y
      const len = Math.hypot(dx, dy) || 1
      const stepSize = Math.min(profile.fleeSpeed * urgency, profile.maxStep)

      offset.current.x += (dx / len) * stepSize
      offset.current.y += (dy / len) * stepSize
      clampOffsetToViewport()
      applyPosition()

      if (!wasThreatened.current) {
        wasThreatened.current = true
        const now = Date.now()
        if (now - lastTauntAt.current > TAUNT_COOLDOWN_MS) {
          lastTauntAt.current = now
          onDodge?.()
        }
      }
    } else {
      wasThreatened.current = false
      offset.current.x *= 1 - profile.returnSpeed
      offset.current.y *= 1 - profile.returnSpeed

      if (Math.abs(offset.current.x) < 0.4) offset.current.x = 0
      if (Math.abs(offset.current.y) < 0.4) offset.current.y = 0

      applyPosition()
    }
  }, [applyPosition, buttonRef, clampOffsetToViewport, disabled, onDodge])

  useLayoutEffect(() => {
    if (disabled) return

    measureHome()

    const slot = slotRef?.current
    const alignEl = alignRef?.current
    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            if (!wasThreatened.current) measureHome()
          })
        : null

    if (slot) observer?.observe(slot)
    if (alignEl) observer?.observe(alignEl)

    return () => observer?.disconnect()
  }, [alignRef, disabled, layoutReady, measureHome, slotRef])

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

    const onPointerMove = (clientX, clientY, { isTouch = false, skipDeadzone = false } = {}) => {
      const profile = profileRef.current

      if (isTouch && profile.pointerDeadzone > 0 && !skipDeadzone) {
        const moved = distance(
          clientX,
          clientY,
          smoothPointer.current.x,
          smoothPointer.current.y,
        )
        if (moved < profile.pointerDeadzone) return
      }

      if (profile.pointerSmoothing < 1) {
        smoothPointer.current.x +=
          (clientX - smoothPointer.current.x) * profile.pointerSmoothing
        smoothPointer.current.y +=
          (clientY - smoothPointer.current.y) * profile.pointerSmoothing
        pointer.current = { ...smoothPointer.current }
      } else {
        pointer.current = { x: clientX, y: clientY }
        smoothPointer.current = { x: clientX, y: clientY }
      }
    }

    const onMouseMove = (e) => onPointerMove(e.clientX, e.clientY)
    const onTouchStart = (e) => {
      const touch = e.touches[0]
      if (!touch) return

      if (touchClearTimer.current) {
        window.clearTimeout(touchClearTimer.current)
        touchClearTimer.current = null
      }

      onPointerMove(touch.clientX, touch.clientY, { isTouch: true, skipDeadzone: true })
      shoveAway(touch.clientX, touch.clientY, { isTap: true })
    }

    const onTouchMove = (e) => {
      const touch = e.touches[0]
      if (touch) onPointerMove(touch.clientX, touch.clientY, { isTouch: true })
    }

    const clearPointer = () => {
      pointer.current = { x: -9999, y: -9999 }
      smoothPointer.current = { x: -9999, y: -9999 }
    }

    const onTouchEnd = () => {
      touchClearTimer.current = window.setTimeout(() => {
        clearPointer()
        touchClearTimer.current = null
      }, 200)
    }
    const onResize = () => {
      if (!wasThreatened.current) measureHome()
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchmove', onTouchMove, { passive: true })
    document.addEventListener('touchend', onTouchEnd, { passive: true })
    document.addEventListener('touchcancel', onTouchEnd, { passive: true })
    window.addEventListener('resize', onResize)

    const loop = () => {
      step()
      rafId.current = requestAnimationFrame(loop)
    }
    rafId.current = requestAnimationFrame(loop)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
      document.removeEventListener('touchcancel', onTouchEnd)
      window.removeEventListener('resize', onResize)
      if (touchClearTimer.current) window.clearTimeout(touchClearTimer.current)
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
