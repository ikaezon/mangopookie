import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { PolaroidLightbox } from './PolaroidLightbox'
import { useReducedMotion } from '../hooks/useReducedMotion'

const DEVELOP_BLUR = 'blur(10px) sepia(0.55)'
const DEVELOP_CLEAR = 'blur(0px) sepia(0)'

export function PolaroidCard({
  src,
  alt = '',
  caption,
  tilt = 0,
  size = 'md',
  className = '',
  delay = 0,
  develop = true,
  zoomable = true,
}) {
  const reducedMotion = useReducedMotion()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [developing, setDeveloping] = useState(false)
  const imgRef = useRef(null)

  const shouldDevelop = develop && !reducedMotion

  const beginDevelop = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setDeveloping(true))
    })
  }, [])

  useEffect(() => {
    setDeveloping(false)
  }, [src])

  useEffect(() => {
    if (!shouldDevelop) return
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) {
      beginDevelop()
    }
  }, [shouldDevelop, src, beginDevelop])

  const isCollage = size === 'collage'
  const isWelcomeCompact = size === 'welcomeTop' || size === 'welcomeBottom'

  const sizeClasses =
    size === 'collage'
      ? 'w-[clamp(6.25rem,28vw,7.75rem)]'
      : size === 'xs'
        ? 'w-[7.5rem]'
        : size === 'welcomeTop'
          ? 'w-[clamp(8.5rem,38vw,11.75rem)]'
          : size === 'welcomeBottom'
            ? 'w-[clamp(7.5rem,34vw,10.25rem)]'
            : size === 'welcome'
              ? 'w-[clamp(10rem,38vw,12.5rem)]'
              : size === 'sm'
                ? 'w-[10.5rem]'
                : size === 'lg'
                  ? 'w-full max-w-[17rem]'
                  : 'w-[13.5rem]'

  const canZoom = zoomable && !reducedMotion

  const openLightbox = () => {
    if (!canZoom) return
    setLightboxOpen(true)
  }

  return (
    <>
      <motion.figure
        className={`${sizeClasses} shrink-0 ${className} ${
          canZoom ? 'cursor-zoom-in touch-manipulation' : ''
        }`}
        style={{ rotate: tilt }}
        initial={reducedMotion ? false : { opacity: 0, y: 18, rotate: tilt - 2 }}
        animate={{ opacity: 1, y: 0, rotate: tilt }}
        transition={{
          duration: 0.36,
          ease: 'easeOut',
          delay: reducedMotion ? 0 : delay,
        }}
        role={canZoom ? 'button' : undefined}
        tabIndex={canZoom ? 0 : undefined}
        onClick={canZoom ? openLightbox : undefined}
        onKeyDown={
          canZoom
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openLightbox()
                }
              }
            : undefined
        }
        aria-label={canZoom ? `View photo: ${caption || alt}` : undefined}
      >
        <div
          className={
            isCollage
              ? 'rounded-[9px] bg-white p-1.5 pb-2.5 shadow-[0_10px_28px_-8px_oklch(0.24_0.03_15_/_0.2)]'
              : isWelcomeCompact
                ? 'rounded-[8px] bg-white p-1.5 pb-2 shadow-[0_8px_24px_-8px_oklch(0.24_0.03_15_/_0.18)]'
                : 'rounded-[10px] bg-white p-2 pb-3 shadow-[0_12px_32px_-8px_oklch(0.24_0.03_15_/_0.18)]'
          }
        >
          <div className="aspect-[3/4] w-full overflow-hidden rounded-[6px] bg-rose-soft">
            {shouldDevelop ? (
              <motion.img
                ref={imgRef}
                src={src}
                alt={alt}
                className="h-full w-full object-cover"
                loading="eager"
                decoding="async"
                onLoad={beginDevelop}
                initial={false}
                animate={{
                  filter: developing ? DEVELOP_CLEAR : DEVELOP_BLUR,
                  opacity: developing ? 1 : 0.65,
                }}
                transition={
                  developing
                    ? { duration: 2.4, ease: 'easeOut', delay }
                    : { duration: 0 }
                }
              />
            ) : (
              <img
                src={src}
                alt={alt}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
          {caption && (
            <figcaption
              className={
                isCollage
                  ? 'mt-1.5 text-center text-[0.68rem] font-medium leading-tight tracking-wide text-ink-muted sm:text-xs'
                  : isWelcomeCompact
                    ? 'mt-1 text-center text-[0.65rem] font-medium leading-tight tracking-wide text-ink-muted'
                    : 'mt-2 text-center text-xs font-medium tracking-wide text-ink-muted'
              }
            >
              {caption}
            </figcaption>
          )}
        </div>
      </motion.figure>

      {canZoom && (
        <PolaroidLightbox
          open={lightboxOpen}
          src={src}
          alt={alt}
          caption={caption}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}
