import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import { MapPin, ArrowSquareOut } from '@phosphor-icons/react'

const CARTO_LIGHT =
  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

const rosePinIcon = L.divIcon({
  className: 'venue-map-pin',
  html: `<svg class="venue-map-pin-svg" viewBox="0 0 32 42" width="32" height="42" aria-hidden="true">
    <path d="M16 2C9.925 2 5 6.925 5 13c0 8.25 11 27 11 27s11-18.75 11-27c0-6.075-4.925-11-11-11z"/>
    <circle cx="16" cy="13" r="5" fill="#fff"/>
  </svg>`,
  iconSize: [32, 42],
  iconAnchor: [16, 42],
})

function MapResizeFix({ containerRef }) {
  const map = useMap()

  useEffect(() => {
    const fix = () => {
      map.invalidateSize({ animate: false, pan: false })
    }

    fix()
    const raf = requestAnimationFrame(fix)
    const delays = [50, 200, 500].map((ms) => window.setTimeout(fix, ms))

    const el = containerRef?.current
    const observer =
      el && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(fix)
        : null
    observer?.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      delays.forEach(window.clearTimeout)
      observer?.disconnect()
    }
  }, [map, containerRef])

  return null
}

function VenueMap({ lat, lng, containerRef }) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      touchZoom={false}
      boxZoom={false}
      keyboard={false}
      zoomControl={false}
      className="venue-map !h-full !w-full"
      style={{ height: '100%', width: '100%' }}
      attributionControl
    >
      <MapResizeFix containerRef={containerRef} />
      <TileLayer
        url={CARTO_LIGHT}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <Marker position={[lat, lng]} icon={rosePinIcon} />
    </MapContainer>
  )
}

export function MapPreview({ venue, compact = false }) {
  const { lat, lng } = venue.coordinates
  const containerRef = useRef(null)
  const mapHeight = compact ? 108 : 180

  return (
    <article className="map-preview-root relative z-0 overflow-hidden rounded-[var(--radius-card)] border border-rose/15 bg-surface shadow-sm transition-shadow hover:shadow-md">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden bg-[#f3efe8]"
        style={{ height: mapHeight }}
      >
        <div className="absolute inset-0">
          <VenueMap lat={lat} lng={lng} containerRef={containerRef} />
        </div>
        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-ink/10 via-transparent to-transparent" />
      </div>

      <a
        href={venue.appleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-3 p-4 transition-colors hover:bg-rose-soft/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-rose"
      >
        <MapPin className="mt-0.5 size-5 shrink-0 text-rose" weight="fill" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink">{venue.name}</p>
          <p className="mt-0.5 text-sm text-ink-muted">{venue.address}</p>
          <p className="mt-1 text-xs font-medium text-rose-deep opacity-80 group-hover:opacity-100">
            Open in Apple Maps
          </p>
        </div>
        <ArrowSquareOut
          className="size-5 shrink-0 text-rose opacity-60 transition-opacity group-hover:opacity-100"
          aria-hidden
        />
      </a>
    </article>
  )
}
