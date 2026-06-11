import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { X } from '@phosphor-icons/react'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function PolaroidLightbox({ open, src, alt, caption, onClose }) {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 safe-top safe-x"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))' }}
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.22 }}
          role="dialog"
          aria-modal="true"
          aria-label={caption || alt || 'Photo'}
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/75 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close photo"
          />
          <motion.figure
            className="relative z-10 w-full max-w-sm"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute -right-1 -top-1 z-20 flex size-9 items-center justify-center rounded-full bg-surface text-ink shadow-md transition-colors hover:bg-rose-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
              aria-label="Close"
            >
              <X className="size-5" weight="bold" aria-hidden />
            </button>
            <div className="rounded-[12px] bg-white p-2.5 pb-4 shadow-[0_24px_64px_-12px_oklch(0.2_0.02_15_/_0.45)]">
              <div className="aspect-[3/4] w-full overflow-hidden rounded-[8px] bg-rose-soft">
                <img
                  src={src}
                  alt={alt}
                  className="h-full w-full object-cover"
                  decoding="async"
                />
              </div>
              {caption && (
                <figcaption className="mt-3 text-center text-sm font-medium tracking-wide text-ink-muted">
                  {caption}
                </figcaption>
              )}
            </div>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
