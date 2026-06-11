# Design System: mangopookie

## Design Read

Personal brand-story webapp for Taite on iPhone-first mobile. Pool-summer playful language with polaroid itinerary cards, then a sincere date-lock modal. Tailwind v4 + Motion with plum / sage / pool-sky palette and pink stripe motif.

## Dials

- DESIGN_VARIANCE: 8 (asymmetric polaroids, stripe accents, tilted cards)
- MOTION_INTENSITY: 7 (screen transitions, marquee, card entrance)
- VISUAL_DENSITY: 3 (airy story screens, denser itinerary cards)

## Color Strategy

Cool sun-washed off-white with subtle pink stripe bands. No cream/beige paper or purple AI gradients.

| Token | Usage |
|-------|-------|
| `--bg` | Page background + stripe motif |
| `--surface` | Polaroid frame, modal |
| `--ink` / `--ink-muted` | Primary and secondary text |
| `--plum` / `--plum-deep` | Primary accent, CTAs |
| `--sage` / `--sage-soft` | Activity chips, secondary accent |
| `--pool` / `--pool-soft` | Day headers, links |
| `--sun` | Warm highlights |
| `--stripe` | Cabana stripe motif |

Legacy `--rose` tokens map to plum for modal/calendar compatibility.

## Typography

- Sans: Outfit for UI, body, buttons
- Display: Bodoni Moda italic for 1–2 hero moments (welcome headline, Friday title)
- Journey body: 1.0625rem, pretty wrap

## Shape

Soft cards (12–16px), pill buttons. Polaroids: white frame, soft shadow, slight rotation.

## Layout

Each screen `min-h-[100dvh]`, safe-area via `.safe-top` / `.px-gutter`. Primary CTA in bottom safe zone (~48px min height). Thin progress bar on story steps (no numbered eyebrows on every screen).

## Motion

`motion/react` page transitions (slide + fade, ~0.36s ease-out). Nickname marquee on welcome. `useReducedMotion`: crossfade only, static marquee.

## Icons

@phosphor-icons/react only.

## Components

- JourneyShell — full-screen wrapper, progress, footer nav
- PolaroidCard — photo + caption + optional tilt
- NicknameMarquee — curated nickname ticker
- JourneyNav — Back / Next
- Welcome, Ready, Friday, Saturday, DateAsk screens
- DateModal (venue → map → date), Celebration confirm
