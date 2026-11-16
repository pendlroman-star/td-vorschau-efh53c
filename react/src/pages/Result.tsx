/* Ergebnisseite: ergebnis.html?hund=<id>&echo=<1–5>[&stil=natur] */
import { useCallback, useEffect, useRef, useState } from 'react'
import { TestMenu } from '../components/dev/TestMenu'
import { SiteFooter } from '../components/layout/SiteFooter'
import { SiteHeader } from '../components/layout/SiteHeader'
import { DonationSection } from '../components/result/DonationSection'
import { MatchSection } from '../components/result/MatchSection'
import { ResultCard } from '../components/result/ResultCard'
import { ResultHero } from '../components/result/ResultHero'
import { HUNDE, hundNachId } from '../data/hunde'
import { useAuftritt } from '../hooks/useAuftritt'
import { istTestSeite } from '../lib/env'
import { leseVorname } from '../lib/text'
import { Wrap } from '../components/ui/Wrap'

interface Props {
  /** kommt direkt vom Quiz (Kreis-Übergang) – in main-ergebnis.tsx einmalig gelesen */
  ankunft: boolean
  /** „Bewegung reduzieren“ (einmal beim Laden abgefragt, wie im Original) */
  ruhig: boolean
}

export function Result({ ankunft, ruhig }: Props) {
  /* ---------- Welcher Hund? (aus ?hund=… – Standard: Border Collie wie im Entwurf) ---------- */
  const adresse = new URLSearchParams(location.search)
  const h = hundNachId(adresse.get('hund'))
  const idx = HUNDE.indexOf(h)
  // Echo-Zeile: Nummer der Quizfrage (1–5), deren Antwort aufgegriffen wird – kommt vom Quiz als ?echo=…
  const echoNr = Math.min(5, Math.max(1, parseInt(adresse.get('echo') ?? '', 10) || 5))
  // Variante „Natur": nur mit ?stil=natur (zum Vergleich mit der Bubble-Fassung) – VOR DEM LIVEGANG ENTFERNEN
  const stilNatur = adresse.get('stil') === 'natur'
  const natur = stilNatur && !!h.video && !ruhig
  const e = h.ergebnis
  const sein = e.er === 'sie' ? 'ihre' : 'seine'
  const ihn = e.er === 'sie' ? 'sie' : 'ihn'
  const [vorname] = useState(leseVorname)
  const werte = { name: e.tiername, vorname }

  // Spendenhäufigkeit; „Jetzt monatlich helfen“ setzt sie auf „monatlich“
  const [freq, setFreq] = useState('monatlich')
  const onDauer = useCallback(() => setFreq('monatlich'), [])

  useEffect(() => { document.title = `${e.tiername} ist dein tierischer Doppelgänger – Arche Noah` }, [e.tiername])

  const heroInner = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLElement>(null)
  const badge = useRef<HTMLDivElement>(null)
  useAuftritt({ heroInner, visual: () => document.getElementById('r-visual'), card, badge }, { ruhig, ankunft })

  return (
    <>
      <SiteHeader seite="ergebnis" />
      <main>
        <section className="relative overflow-clip bg-cream isolate pb-[clamp(48px,6vw,80px)]" aria-labelledby="r-title">
          <svg className="absolute inset-x-0 bottom-0 -z-1 w-full h-[55%] tablet:h-[40%] text-sand" viewBox="0 0 1440 520" preserveAspectRatio="none" aria-hidden="true"><path fill="currentColor" d="M0 60c160 70 300 110 470 90 190-22 260-120 470-110 200 10 330 120 500 170V520H0Z" /></svg>
          <ResultHero h={h} idx={idx} vorname={vorname} echoNr={echoNr} ruhig={ruhig} natur={natur} innerRef={heroInner} />
          {/* 2) Dein tierischer Doppelgänger aus dem Tierheim */}
          <Wrap>
            <ResultCard e={e} werte={werte} onDauer={onDauer} cardRef={card} badgeRef={badge} />
          </Wrap>
        </section>
        <DonationSection e={e} ihn={ihn} freq={freq} onFreq={setFreq} />
        <MatchSection h={h} e={e} sein={sein} ihn={ihn} onDauer={onDauer} />
      </main>
      <SiteFooter seite="ergebnis" />
      {/* Testmenü: nur auf der Testseite – VOR DEM LIVEGANG ENTFERNEN */}
      {istTestSeite() && <TestMenu hund={h.id} echoNr={echoNr} natur={stilNatur} />}
    </>
  )
}
