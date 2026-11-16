/* Hunde-Slider im Hero: sechs Hunde wechseln sich ab, die Formen gleiten mit.
   Das Gerüst rendert React; Ablauf und Videos steuert heroSliderController.ts. */
import { useEffect, useRef, useState } from 'react'
import { BUBBLES } from '../../data/formen'
import { HUNDE } from '../../data/hunde'
import { reduce, reduceMQ } from '../../lib/env'
import { createHeroSlider, type SliderSteuerung } from './heroSliderController'
import { PauseButton } from './PauseButton'
import './heroSlider.css'


export function HeroSlider({ onStart }: { onStart: () => void }) {
  // Bei „Bewegung reduzieren“ im System startet alles angehalten
  const [still, setStill] = useState(reduce)
  const showcase = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const breed = useRef<HTMLSpanElement>(null)
  const steuerung = useRef<SliderSteuerung | null>(null)

  useEffect(() => {
    const s = stage.current!, sc = showcase.current!
    const ctl = createHeroSlider({
      showcase: sc,
      stage: s,
      breed: breed.current!,
      bubbles: [...s.querySelectorAll<HTMLElement>('.bubble')],
      layers: [...s.querySelectorAll<HTMLElement>('.layer')],
      slides: [...s.querySelectorAll<HTMLElement>('.dog')],
    }, { initialStill: reduce() })
    steuerung.current = ctl
    const onReduce = () => setStill(reduce())
    reduceMQ.addEventListener?.('change', onReduce)
    return () => {
      reduceMQ.removeEventListener?.('change', onReduce)
      ctl.destroy()
      steuerung.current = null
    }
  }, [])

  useEffect(() => { steuerung.current?.setStill(still) }, [still])

  return (
    <div ref={showcase} className={`showcase${still ? ' is-still' : ''}`} id="showcase" role="region" aria-roledescription="Karussell" aria-label="Die sechs Hunde-Charaktere">
      <div ref={stage} className="stage" id="stage">
        <div className="layer" data-depth="-1" aria-hidden="true">
          {BUBBLES.map((d, i) => (
            <div key={i} className={`bubble bubble--${i + 1}`}><div className="bubble__pulse"><svg viewBox="0 0 200 200"><path d={d} /></svg></div></div>
          ))}
        </div>
        <div className="layer" data-depth="1">
          <div className="dog-shadow" aria-hidden="true" />
          <div className="dogs" id="dogs">
            {/* Inhalt und Sichtbarkeit der Folien setzt der Controller */}
            {HUNDE.map((h, i) => (
              <figure key={h.id} className="dog" role="group" aria-roledescription="Folie" aria-label={`${i + 1} von ${HUNDE.length}: ${h.name}`} />
            ))}
          </div>
        </div>
        <a className="badge" href="#quiz" onClick={onStart} aria-label="Dein Hunde-Match wartet! Jetzt Quiz starten">
          <svg className="badge__ring" viewBox="0 0 120 120" aria-hidden="true"><defs><path id="badgeCircle" d="M60 60m-43 0a43 43 0 1 1 86 0a43 43 0 1 1-86 0" /></defs><text textLength="258" lengthAdjust="spacing"><textPath href="#badgeCircle" textLength="258" lengthAdjust="spacing">DEIN HUNDE-MATCH WARTET! ♥</textPath></text></svg>
          <svg className="badge__heart" viewBox="0 0 48 48" aria-hidden="true"><path d="M24.3 40.5c-6.8-4.6-15.6-11.2-17.6-18.4-1.6-5.6 1.6-11.4 7-12.1 4.3-.6 8.4 2.4 10.4 6.6 1.9-4.6 6-7.6 10.6-6.9 5.6.9 8.3 7 6.3 12.6-2.4 6.9-10.5 13.3-16.9 18.1" /></svg>
        </a>
      </div>

      <div className="relative z-2 flex items-center justify-center gap-3 mt-2.5">
        <p className="relative z-2 m-0 min-h-[1.5em] font-head font-bold text-[.95rem] tracking-[.14em] uppercase text-center text-forest" aria-hidden="true">
          <span ref={breed} className="inline-block will-change-[transform,opacity]" />
        </p>
        {/* Pausezeichen sichtbar (16.11., Barrierefreiheit WCAG 2.2.2) */}
        <PauseButton still={still} onToggle={() => setStill(s => !s)} />
      </div>
    </div>
  )
}
