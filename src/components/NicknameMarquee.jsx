import { nicknames } from '../config/journey'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function NicknameMarquee() {
  const reducedMotion = useReducedMotion()
  const line = nicknames.map((n) => `${n} ·`).join(' ')
  const doubled = `${line} ${line}`

  if (reducedMotion) {
    return (
      <p className="text-center text-sm font-medium tracking-wide text-rose-glow">
        {nicknames.slice(0, 4).join(' · ')}
      </p>
    )
  }

  return (
    <div
      className="relative w-full overflow-hidden py-1"
      aria-hidden
    >
      <div className="nickname-marquee-track flex w-max gap-8 whitespace-nowrap text-sm font-medium tracking-wide text-rose-glow">
        <span>{doubled}</span>
        <span>{doubled}</span>
      </div>
    </div>
  )
}
