import { motion } from 'motion/react'
import { Heart } from '@phosphor-icons/react'
import { useReducedMotion } from '../hooks/useReducedMotion'

const HEARTS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 5) % 96}%`,
  size: 14 + (i % 5) * 6,
  delay: (i * 0.55) % 10,
  duration: 12 + (i % 6) * 2.5,
  drift: (i % 2 === 0 ? 1 : -1) * (18 + (i % 7) * 10),
  opacity: 0.12 + (i % 4) * 0.1,
  weight: i % 3 === 0 ? 'fill' : 'duotone',
}))

function HeartParticle({ heart, reducedMotion }) {
  if (reducedMotion) return null

  return (
    <motion.div
      className="pointer-events-none absolute top-0 will-change-transform"
      style={{
        left: heart.left,
        marginLeft: -heart.size / 2,
      }}
      initial={{ y: '-8vh', opacity: 0, x: 0 }}
      animate={{
        y: ['-8vh', '108vh'],
        opacity: [0, heart.opacity, heart.opacity, 0],
        x: [0, heart.drift, heart.drift * 0.6, heart.drift * 1.2],
        rotate: [0, (heart.id % 2 === 0 ? 1 : -1) * 18, 0],
      }}
      transition={{
        duration: heart.duration,
        delay: heart.delay,
        repeat: Infinity,
        ease: 'linear',
      }}
      aria-hidden
    >
      <Heart
        className="text-rose-glow drop-shadow-sm"
        style={{ width: heart.size, height: heart.size }}
        weight={heart.weight}
      />
    </motion.div>
  )
}

export function FloatingHearts() {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) return null

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      {HEARTS.map((heart) => (
        <HeartParticle key={heart.id} heart={heart} reducedMotion={reducedMotion} />
      ))}
    </div>
  )
}
