/* ==================================================================
   ÜBERGANG „Dein Doppelgänger wird analysiert …“
   Kreis öffnet sich aus dem Absende-Knopf, „Glücksrad“ der Hunde wird
   langsamer und bleibt beim Ergebnis stehen, dann „Match gefunden!“ und
   Weiterleitung auf die Ergebnisseite. Zeiten unverändert aus dem Original.
   ================================================================== */
import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CONFIG } from '../../data/config'
import { BUBBLES } from '../../data/formen'
import { HUNDE, type Hund, type HundId } from '../../data/hunde'
import { clipStart, schleifenClip } from '../../lib/clips'
import { reduce } from '../../lib/env'
import { ANKUNFT_KEY } from '../../lib/text'
import { ClipHost } from '../ui/ClipHost'
import { HeartIcon, PawIcon } from '../ui/icons'
import './analysis.css'

interface Props {
  hund: Hund
  /** Nummer der Quizfrage für die Echo-Zeile (1–5) */
  echo: number
  /** von hier aus öffnet sich der Kreis (Absende-Knopf) */
  von: DOMRect | null
}

const TAKTE = [200, 200, 210, 220, 240, 260, 290, 330, 380, 450, 540, 650]
const TEXTE: [number, string][] = [[0, 'Antworten werden ausgewertet'], [1300, 'Charakterzüge werden verglichen'], [2700, 'Fast geschafft …']]

export function Analysis({ hund: h, echo, von }: Props) {
  // Bewegung reduzieren: einmal beim Start festgelegt
  const [ruhig] = useState(reduce)
  const mitClip = !!h.video && !ruhig
  const overlay = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLParagraphElement>(null)
  const stepEl = useRef<HTMLParagraphElement>(null)
  const hearts = useRef<HTMLDivElement>(null)
  const clipMedia = useRef<HTMLElement | null>(null)
  // Bewegung reduzieren: sofort das Ergebnis, ohne Glücksrad
  const [aktiv, setAktiv] = useState<HundId | null>(ruhig ? h.id : null)
  const [pfoten, setPfoten] = useState(ruhig ? 5 : 0)
  const [schritt, setSchritt] = useState(ruhig ? 'Match gefunden!' : 'Antworten werden ausgewertet')
  const [match, setMatch] = useState(false)

  useLayoutEffect(() => {
    const ov = overlay.current!
    const ziel = `${CONFIG.ergebnisSeite}?hund=${encodeURIComponent(h.id)}&echo=${echo}`
    const timer: number[] = []
    const nach = (ms: number, fn: () => void) => { timer.push(window.setTimeout(fn, ms)) }
    const go = () => { try { sessionStorage.setItem(ANKUNFT_KEY, '1') } catch { /* egal */ } location.href = ziel }
    document.documentElement.style.overflow = 'hidden'
    const aufraeumen = () => { timer.forEach(clearTimeout); document.documentElement.style.overflow = '' }

    if (ruhig) {
      nach(1600, go)
      return aufraeumen
    }

    // Aufgehen wie ein Kreis aus dem Knopf heraus
    const r = von ?? ov.getBoundingClientRect()
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2
    ov.animate([{ clipPath: `circle(0px at ${cx}px ${cy}px)` }, { clipPath: `circle(150vmax at ${cx}px ${cy}px)` }],
      { duration: 700, easing: 'cubic-bezier(.65, 0, .35, 1)', fill: 'both' })
    inner.current!.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }],
      { duration: 500, delay: 300, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both' })

    // „Glücksrad": Hunde wechseln, werden langsamer und bleiben beim Ergebnis stehen
    const order = HUNDE.map(x => x.id)
    let t = 500
    const end = order.indexOf(h.id)
    const start = (((end - (TAKTE.length - 1)) % order.length) + order.length) % order.length   // letzter Takt = Ergebnis
    TAKTE.forEach((ms, n) => { t += ms; const id = order[(start + n) % order.length]; nach(t, () => setAktiv(id)) })
    const tMatch = t + 350

    // Texte & Pfoten als Fortschritt
    TEXTE.forEach(([ms, txt]) => nach(300 + ms, () => {
      setSchritt(txt)
      stepEl.current?.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: .85, transform: 'none' }], { duration: 300, fill: 'both' })
    }))
    for (let n = 0; n < 5; n++) nach(500 + n * ((tMatch - 600) / 5), () => setPfoten(p => Math.max(p, n + 1)))

    // Match!
    nach(tMatch, () => {
      setMatch(true)
      if (mitClip) { setAktiv(null); clipStart(clipMedia.current) }
      setSchritt('Gleich lernst du deinen Doppelgänger kennen')
      title.current?.animate([{ transform: 'scale(.9)' }, { transform: 'scale(1.06)', offset: .6 }, { transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.34, 1.4, .64, 1)' })
      stage.current?.animate([{ transform: 'none' }, { transform: 'scale(1.06)', offset: .5 }, { transform: 'none' }], { duration: 500, easing: 'ease-out' })
      hearts.current?.querySelectorAll('svg').forEach((s, n) => {
        const a = (n / 7) * Math.PI * 2 - Math.PI / 2, d = 150 + (n % 3) * 30
        s.animate([
          { opacity: 0, transform: 'translate(-50%, -50%) scale(.3)' },
          { opacity: 1, transform: `translate(calc(-50% + ${Math.cos(a) * d * .6}px), calc(-50% + ${Math.sin(a) * d * .6}px)) scale(1)`, offset: .45 },
          { opacity: 0, transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) scale(.8) rotate(${n * 20 - 60}deg)` },
        ], { duration: 1000, delay: n * 25, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both' })
      })
    })
    nach(Math.max(CONFIG.analyseDauer, tMatch + (h.video ? 2600 : 1300)), go)   // mit Clip: Bewegung kurz zeigen
    return aufraeumen
  }, [h, echo, von, ruhig, mitClip])

  return createPortal(
    <div ref={overlay} className={`analyse${match ? ' is-match' : ''}`} role="status">
      <div ref={inner} className="analyse__inner">
        <div ref={stage} className="analyse__stage" aria-hidden="true">
          <svg className="analyse__ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" /></svg>
          <svg className="analyse__blob" viewBox="0 0 200 200"><path d={BUBBLES[0]} /></svg>
          <svg className="analyse__blob analyse__blob--2" viewBox="0 0 200 200"><path d={BUBBLES[1]} /></svg>
          {HUNDE.map(x => <img key={x.id} className={`analyse__dog${aktiv === x.id ? ' is-on' : ''}`} src={x.bild} alt="" data-id={x.id} />)}
          {mitClip && <ClipHost className="analyse__clip" bauen={() => schleifenClip(h)} autoStart={false} mediaRef={clipMedia} />}
        </div>
        <p ref={title} className="analyse__title m-0 font-fun font-extrabold uppercase tracking-[.005em] text-forest text-[clamp(1.7rem,4.6vw,2.6rem)] leading-[1.05]">
          <span className="analyse__label">
            {match ? 'Match gefunden!' : <>Dein Doppelgänger wird <span className="nowrap">analysiert<span className="dots" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span></span></>}
          </span>
        </p>
        <p ref={stepEl} className="analyse__step">{schritt}</p>
        <div className="analyse__paws" aria-hidden="true">
          {[0, 1, 2, 3, 4].map(n => <PawIcon key={n} className={n < pfoten ? 'is-on' : undefined} />)}
        </div>
      </div>
      <div ref={hearts} className="analyse__hearts" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5, 6].map(n => <HeartIcon key={n} />)}
      </div>
    </div>,
    document.body,
  )
}
