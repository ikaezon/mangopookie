import { lazy, Suspense } from 'react'

const MapPreview = lazy(() =>
  import('./MapPreview').then((module) => ({ default: module.MapPreview })),
)

function MapPlaceholder({ tight = false }) {
  const height = tight ? 72 : 108
  return (
    <div
      className="overflow-hidden rounded-[var(--radius-card)] border border-rose/15 bg-[#f3efe8]"
      style={{ height }}
      aria-hidden
    />
  )
}

export function MapPreviewLazy(props) {
  return (
    <Suspense fallback={<MapPlaceholder tight={props.tight} />}>
      <MapPreview {...props} />
    </Suspense>
  )
}
