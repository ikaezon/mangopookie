import { AnimatePresence, motion } from 'motion/react'
import { useVisualViewportBottom } from '../hooks/useVisualViewportBottom'

export function NoButtonTease({ line, placement = 'fixed' }) {
  const viewportBottom = useVisualViewportBottom()

  if (placement === 'inline') {
    return (
      <AnimatePresence mode="wait">
        {line && (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none mb-3 w-full max-w-[min(90vw,280px)] text-center text-sm font-medium text-rose-deep"
            aria-live="polite"
          >
            {line}
          </motion.p>
        )}
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {line && (
        <motion.p
          key={line}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none fixed left-1/2 z-50 max-w-[min(90vw,280px)] -translate-x-1/2 text-center text-sm font-medium text-rose-deep"
          style={{
            bottom: `calc(${viewportBottom}px + env(safe-area-inset-bottom, 0px))`,
          }}
          aria-live="polite"
        >
          {line}
        </motion.p>
      )}
    </AnimatePresence>
  )
}
