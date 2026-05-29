import { useEffect, useState } from 'react'

const DEFAULT_BOTTOM = 32
const CHROME_PADDING = 12

/**
 * Offset for fixed bottom UI so it clears Safari's tab/URL bar on iOS.
 * safe-area-inset-bottom only covers the home indicator, not browser chrome.
 */
export function useVisualViewportBottom() {
  const [bottom, setBottom] = useState(DEFAULT_BOTTOM)

  useEffect(() => {
    const update = () => {
      const vv = window.visualViewport
      if (!vv) {
        setBottom(DEFAULT_BOTTOM)
        return
      }

      const browserChrome = Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
      setBottom(Math.max(DEFAULT_BOTTOM, browserChrome + CHROME_PADDING))
    }

    update()
    window.visualViewport?.addEventListener('resize', update)
    window.visualViewport?.addEventListener('scroll', update)
    window.addEventListener('resize', update)

    return () => {
      window.visualViewport?.removeEventListener('resize', update)
      window.visualViewport?.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return bottom
}
