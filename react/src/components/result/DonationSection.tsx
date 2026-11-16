/* Spendenbereich. Auf *.aktivertierschutz.at wird automatisch das echte Formular (iframe +
   drei Skripte des Anbieters) eingesetzt – anderswo blockiert es der Anbieter, daher zeigt
   der Prototyp eine Nachbildung (DonationPreviewForm). */
import { useEffect } from 'react'
import { SPENDEN_SKRIPTE, spendenFormularUrl } from '../../data/config'
import type { Ergebnis } from '../../data/hunde'
import { istLiveSeite } from '../../lib/env'
import { Wrap } from '../ui/Wrap'
import { DonationPreviewForm } from './DonationPreviewForm'

interface Props {
  e: Ergebnis
  /** „ihn“ bzw. „sie“ */
  ihn: string
  freq: string
  onFreq: (f: string) => void
}

export function DonationSection({ e, ihn, freq, onFreq }: Props) {
  const live = istLiveSeite()

  // Echtes Formular – genauso eingebunden wie auf aktivertierschutz.at/spenden (Skripte in fester Reihenfolge)
  useEffect(() => {
    if (!live) return
    SPENDEN_SKRIPTE.forEach(src => {
      if (document.querySelector(`script[src="${src}"]`)) return
      const sc = document.createElement('script'); sc.src = src; sc.async = false; document.body.appendChild(sc)
    })
  }, [live])

  return (
    <section className="relative py-[clamp(56px,8vw,104px)] bg-cream overflow-clip scroll-mt-(--header-h) before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-[140px] before:bg-[linear-gradient(var(--color-sand),var(--color-cream))] before:pointer-events-none" id="spenden" aria-labelledby="s-title">
      <Wrap className="relative grid grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] gap-[clamp(28px,5vw,72px)] items-start tablet:grid-cols-1">
        <div className="sticky top-[calc(var(--header-h)+32px)] tablet:static" data-in>
          <p className="inline-block m-0 mb-4 py-[.35em] px-[.95em] rounded-full bg-forest text-lime font-bold text-[.9rem]">Gemeinsam helfen</p>
          <h2 id="s-title" className="m-0 mb-[.8rem] font-head font-extrabold text-[clamp(1.7rem,3.2vw,2.5rem)] uppercase leading-[1.08] text-balance">Hilf {e.tiername} und allen anderen Tieren in Not</h2>
          <p className="m-0 mb-[1.4rem] text-[1.08rem] max-w-[46ch]">{`${e.tiername} wartet bei uns auf ein Zuhause. Bis es so weit ist, kümmern wir uns um ${ihn} – mit Futter, tierärztlicher Versorgung und viel Zuwendung. Mit deiner Spende hilfst du ${e.tiername} und allen anderen Tieren im Tierheim.`}</p>
          <p className="flex items-center gap-2.5 m-0 text-[.95rem]"><svg className="flex-none size-[22px] text-lime-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5" /><path d="M7.5 12.5l3 3 6-6.5" /></svg>Deine Spende ist steuerlich absetzbar.</p>
        </div>

        <div data-in>
          <div className="relative rounded-[22px] bg-white shadow-[0_1px_2px_rgba(13,58,32,.05),0_30px_70px_-34px_rgba(13,58,32,.45)] p-[clamp(18px,3vw,34px)] before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-1.5 before:rounded-t-[22px] before:bg-red">
            {live ? (
              <iframe
                className="fso_iframe block w-full min-h-[900px] border-0"
                src={spendenFormularUrl()}
                title="Spendenformular"
                loading="lazy"
                allow="clipboard-write;payment"
                sandbox="allow-scripts allow-same-origin allow-top-navigation allow-forms allow-popups allow-popups-to-escape-sandbox"
              />
            ) : (
              <DonationPreviewForm freq={freq} onFreq={onFreq} />
            )}
          </div>
          {!live && <p className="mt-[.9rem] mb-0 text-[.82rem] opacity-65 text-center">Vorschau: Auf aktivertierschutz.at erscheint hier das echte Spendenformular.</p>}
        </div>
      </Wrap>
    </section>
  )
}
