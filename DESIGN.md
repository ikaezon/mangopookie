# Design System: mangopookie

## Design Read

Premium romantic interactive page for Taite, playful and sincere, leaning Tailwind v4 + Motion with committed rose palette.

## Dials

- DESIGN_VARIANCE: 7
- MOTION_INTENSITY: 8
- VISUAL_DENSITY: 2

## Color Strategy

Committed rose/pink accent on cool off-white background. No cream, beige, or purple AI gradients.

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | oklch(0.985 0.004 250) | Page background |
| `--surface` | oklch(0.995 0.003 250) | Cards, modal |
| `--ink` | oklch(0.22 0.02 15) | Primary text |
| `--ink-muted` | oklch(0.45 0.025 15) | Secondary text |
| `--rose` | oklch(0.58 0.18 12) | Primary accent |
| `--rose-deep` | oklch(0.48 0.16 12) | Hover, emphasis |
| `--rose-soft` | oklch(0.94 0.04 12) | Soft fills |

## Typography

- Sans: Outfit (400, 500, 600, 700) for UI and body
- Display: Bodoni Moda italic (high-contrast editorial) for hero greeting and question
- Hero greeting: `--rose-vivid`, no background boxes or borders on type
- Hero question: `--rose-deep`, smaller scale for hierarchy
- Hero greeting: clamp(3.25rem, 8vw, 5.5rem), italic 400
- Hero question: clamp(2rem, 5.25vw, 3.35rem), italic 400
- Body: 1.0625rem, pretty wrap

## Shape

All-soft: 12-16px card radius, pill buttons (9999px).

## Layout

Hero min-h-[100dvh], asymmetric split on desktop, stack on mobile. Safe area insets for iPhone.

## Motion

motion/react with spring physics. useMotionValue for runaway No button. Reduced motion: instant placement, fade transitions only.

## Icons

@phosphor-icons/react only.

## Components

- Hero with greeting and question
- Runaway No button (never clickable success)
- Native dialog date picker modal
- Map preview card linking to Apple Maps
- Celebration confirm with Google Calendar CTA
