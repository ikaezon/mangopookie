import { motion } from 'motion/react'
import {
  Check,
  GameController,
  Wine,
  BowlFood,
  Coffee,
  Planet,
  SunHorizon,
  Bed,
} from '@phosphor-icons/react'
import { useReducedMotion } from '../hooks/useReducedMotion'

const iconMap = {
  wine: Wine,
  game: GameController,
  food: BowlFood,
  breakfast: Coffee,
  earth: Planet,
  beach: SunHorizon,
  bed: Bed,
}

export function JourneySelectOption({
  option,
  selected,
  onToggle,
  index = 0,
}) {
  const reducedMotion = useReducedMotion()
  const Icon = iconMap[option.icon] ?? BowlFood

  return (
    <motion.li
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.32,
        ease: 'easeOut',
        delay: reducedMotion ? 0 : index * 0.06,
      }}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={selected}
        onClick={() => onToggle(option.id)}
        className={`flex w-full items-center gap-3 rounded-[var(--radius-card)] border px-4 py-3.5 text-left transition-colors ${
          selected
            ? 'border-rose/35 bg-rose-soft/90 shadow-[0_4px_20px_-8px_oklch(0.58_0.18_12_/_0.2)]'
            : 'border-rose/12 bg-surface/90 shadow-[0_2px_12px_-6px_oklch(0.24_0.03_15_/_0.08)]'
        }`}
      >
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            selected
              ? 'border-rose bg-rose text-white'
              : 'border-rose/30 bg-white text-transparent'
          }`}
          aria-hidden
        >
          <motion.span
            initial={false}
            animate={{
              scale: selected ? 1 : 0.6,
              opacity: selected ? 1 : 0,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          >
            <Check size={14} weight="bold" />
          </motion.span>
        </span>

        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            selected ? 'bg-rose/15' : 'bg-sun/35'
          }`}
          aria-hidden
        >
          <Icon
            size={20}
            weight="duotone"
            className={selected ? 'text-rose-deep' : 'text-rose-glow'}
          />
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={`block text-base font-semibold ${
              selected ? 'text-ink' : 'text-ink-muted'
            }`}
          >
            {option.label}
          </span>
          {option.hint && (
            <span className="mt-0.5 block text-xs text-ink-muted">
              {option.hint}
            </span>
          )}
        </span>
      </button>
    </motion.li>
  )
}
