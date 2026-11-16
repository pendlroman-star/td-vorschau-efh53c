/* ==================================================================
   GERÄTEANSICHT – NUR FÜR ENTWICKLER/TEST. VOR DEM LIVEGANG ENTFERNEN.
   (portiert aus geraete.js) Kleiner Schalter „Desktop · Tablet · Smartphone“
   mitten im Header. Tablet/Smartphone öffnen geraete.html, die die aktuelle
   Seite in Gerätebreite zeigt. Erscheint nie auf *.aktivertierschutz.at und
   nicht in der Geräteansicht selbst (siehe SiteHeader).
   ================================================================== */
import type { ReactNode } from 'react'

const ICON: Record<'desktop' | 'tablet' | 'phone', ReactNode> = {
  desktop: <path d="M3 5h18v11H3zM9 20h6M12 16v4" />,
  tablet: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M11 18h2" /></>,
  phone: <><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M11 18h2" /></>,
}
export const GeraetIcon = ({ g }: { g: keyof typeof ICON }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-3.5">{ICON[g]}</svg>
)

const LINK = 'inline-flex items-center gap-[5px] py-1.5 px-2.5 rounded-full no-underline whitespace-nowrap'
const AKTIV = 'bg-white text-forest'
const NORMAL = 'text-white/75 hover:text-white hover:bg-white/12'

export function DeviceSwitch() {
  const seite = (location.pathname.split('/').pop() || 'index.html') + location.search
  const ziel = (g: string) => `geraete.html?g=${g}&s=${encodeURIComponent(seite)}`
  return (
    <nav
      aria-label="Geräteansicht (nur Testseite)"
      className="absolute left-1/2 top-1/2 -translate-1/2 flex [@media(max-width:899px)]:hidden gap-0.5 p-[3px] rounded-full bg-white/10 [font:700_12px/1_system-ui,sans-serif]"
    >
      <a href="#" aria-current="true" className={`${LINK} ${AKTIV}`} onClick={e => e.preventDefault()}><GeraetIcon g="desktop" />Desktop</a>
      <a href={ziel('tablet')} className={`${LINK} ${NORMAL}`}><GeraetIcon g="tablet" />Tablet</a>
      <a href={ziel('phone')} className={`${LINK} ${NORMAL}`}><GeraetIcon g="phone" />Smartphone</a>
    </nav>
  )
}
