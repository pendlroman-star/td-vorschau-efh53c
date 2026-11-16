import { useEffect, useState } from 'react'

/** true, sobald die Seite mehr als `ab` Pixel gescrollt ist (Header bekommt dann Schatten) */
export function useScrolled(ab = 8): boolean {
  const [scrolled, setScrolled] = useState(() => window.scrollY > ab)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > ab)
    addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => removeEventListener('scroll', onScroll)
  }, [ab])
  return scrolled
}
