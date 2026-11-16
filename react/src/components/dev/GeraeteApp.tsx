/* ==================================================================
   GERÄTEANSICHT (geraete.html) – NUR FÜR ENTWICKLER/TEST. VOR DEM LIVEGANG ENTFERNEN.
   Zeigt eine Seite dieser Testseite in Tablet- oder Smartphone-Breite (iframe),
   optional quer; verkleinert auf den verfügbaren Platz (nie vergrößert).
   geraete.html?g=tablet|phone&quer=1&s=<seite.html?…>
   ================================================================== */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { GeraetIcon } from './DeviceSwitch'

const GERAETE = { tablet: { w: 820, h: 1180, name: 'Tablet (iPad Air)' }, phone: { w: 390, h: 844, name: 'Smartphone (iPhone 14)' } }
type Geraet = keyof typeof GERAETE

const p = new URLSearchParams(location.search)
const START_G: Geraet = p.get('g') === 'tablet' ? 'tablet' : 'phone'
const SEITE = p.get('s') || 'index.html'
// nur Seiten dieser Testseite zulassen
const START_SRC = /^[\w-]+\.html(\?.*)?$/.test(SEITE) ? SEITE : 'index.html'

const KNOPF = 'inline-flex items-center gap-[5px] py-1.5 px-3 border-0 rounded-full [font-family:inherit] no-underline cursor-pointer whitespace-nowrap'
const AKTIV = 'bg-white text-forest'
const NORMAL = 'bg-transparent text-white/80 hover:text-white hover:bg-white/12'

export function GeraeteApp() {
  const [g, setG] = useState<Geraet>(START_G)
  const [quer, setQuer] = useState(p.get('quer') === '1')
  const frame = useRef<HTMLIFrameElement>(null)
  const geraet = useRef<HTMLDivElement>(null)
  const buehne = useRef<HTMLDivElement>(null)
  const d = GERAETE[g], w = quer ? d.h : d.w, h = quer ? d.w : d.h

  // aktuelle Adresse in der Vorschau (z. B. nach dem Quiz auf der Ergebnisseite)
  const aktuell = () => { try { const l = frame.current!.contentWindow!.location; return l.pathname.split('/').pop() + l.search } catch { return SEITE } }

  // auf den verfügbaren Platz verkleinern (nie vergrößern)
  const passen = useCallback(() => {
    const ge = geraet.current, b = buehne.current
    if (!ge || !b) return
    ge.style.scale = '1'
    const r = ge.getBoundingClientRect(), br = b.getBoundingClientRect()
    ge.style.scale = String(Math.min(1, (br.width - 40) / r.width, (br.height - 40) / r.height))
  }, [])
  useLayoutEffect(passen, [g, quer, passen])
  useEffect(() => { addEventListener('resize', passen); return () => removeEventListener('resize', passen) }, [passen])

  const waehlen = (neu: Geraet | 'desktop') => {
    if (neu === 'desktop') { location.href = aktuell(); return }
    setG(neu)
    history.replaceState(null, '', `?g=${neu}${quer ? '&quer=1' : ''}&s=${encodeURIComponent(aktuell())}`)
  }

  return (
    <div className="flex flex-col h-full m-0 bg-[#e4e6dc] [font:14px/1.4_system-ui,-apple-system,sans-serif] text-forest">
      <div className="flex items-center justify-center gap-4 flex-wrap py-2.5 px-4 bg-forest text-cream">
        <b className="font-bold">Geräteansicht</b>
        <nav className="flex gap-0.5 p-[3px] rounded-full bg-white/10" aria-label="Gerät">
          {(['desktop', 'tablet', 'phone'] as const).map(k => (
            <a key={k} href="#" aria-current={k === g} className={`${KNOPF} ${k === g ? AKTIV : NORMAL}`} onClick={e => { e.preventDefault(); waehlen(k) }}>
              <GeraetIcon g={k} />{k === 'desktop' ? 'Desktop' : k === 'tablet' ? 'Tablet' : 'Smartphone'}
            </a>
          ))}
        </nav>
        <div className="flex gap-0.5 p-[3px] rounded-full bg-white/10"><button type="button" aria-pressed={quer} className={`${KNOPF} ${quer ? AKTIV : NORMAL}`} onClick={() => setQuer(q => !q)}>Quer</button></div>
        <span className="opacity-70 tabular-nums">{d.name} · {w} × {h}</span>
      </div>
      <div ref={buehne} className="flex-1 min-h-0 relative overflow-hidden">
        <div ref={geraet} className={`absolute left-1/2 top-1/2 -translate-1/2 bg-[#1d1d1f] shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)] origin-center ${g === 'tablet' ? 'rounded-[30px] p-[18px]' : 'rounded-[36px] p-3.5'}`}>
          <iframe ref={frame} src={START_SRC} title="Vorschau der Seite" style={{ width: w, height: h }} className={`block border-0 bg-white ${g === 'tablet' ? 'rounded-xl' : 'rounded-[22px]'}`} />
        </div>
      </div>
    </div>
  )
}
