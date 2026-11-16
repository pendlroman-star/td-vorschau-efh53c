/* Karte: der echte Hund aus dem Tierheim erzählt (Begrüßung, Brief, Bitte, Knopf) */
import type { Ref } from 'react'
import type { Ergebnis } from '../../data/hunde'
import { textFuellen, type TextWerte } from '../../lib/text'
import { ButtonLink } from '../ui/Button'
import { PawIcon } from '../ui/icons'
import { RichText } from '../ui/RichText'
import { DISPLAY } from '../ui/styles'
import { HERVOR, Letter } from './Letter'
import { TrueLoveBadge } from './TrueLoveBadge'

interface Props {
  e: Ergebnis
  werte: TextWerte
  onDauer: () => void
  cardRef: Ref<HTMLElement>
  badgeRef: Ref<HTMLDivElement>
}

export function ResultCard({ e, werte, onDauer, cardRef, badgeRef }: Props) {
  // Begrüßung: erster Satz groß mit markiertem Namen („Hey, ich bin Bruno!"), der Rest als erster Absatz des Briefs
  const hallo = textFuellen(e.hallo, werte), ende = hallo.indexOf('!') + 1
  const kopf = hallo.slice(0, ende).replace(' ich bin', ' ich bin')
  // Das Satzzeichen nach dem Namen gehört in die Markierung – sonst liegt der grüne Balken darüber
  const markiert = kopf.includes(e.tiername + '!') ? e.tiername + '!' : e.tiername
  const pos = kopf.indexOf(markiert)
  const halloRest = hallo.slice(ende).trim()

  return (
    <article ref={cardRef} id="match-card" aria-labelledby="mc-name" data-in className="relative grid grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] tablet:grid-cols-1 gap-[clamp(20px,3.4vw,48px)] items-start p-[clamp(14px,2vw,24px)] rounded-[26px] bg-white shadow-[0_1px_2px_rgba(13,58,32,.05),0_30px_70px_-34px_rgba(13,58,32,.5)]">
      {/* Das Foto bleibt beim Lesen des Briefs stehen */}
      {e.foto ? (
        <figure className="sticky top-[calc(var(--header-h)+20px)] m-0 aspect-[3/4] max-h-[calc(100svh-var(--header-h)-40px)] rounded-2xl overflow-hidden bg-lime-100 tablet:relative tablet:top-auto tablet:aspect-[4/3] tablet:max-h-none">
          <img className="absolute inset-0 w-full h-full object-cover" src={e.foto} alt={`${e.tiername}, dein tierischer Doppelgänger`} style={{ objectPosition: e.fokus || '50% 50%' }} />
        </figure>
      ) : (
        <figure className="sticky top-[calc(var(--header-h)+20px)] m-0 aspect-[3/4] max-h-[calc(100svh-var(--header-h)-40px)] rounded-2xl overflow-hidden bg-lime-100 tablet:relative tablet:top-auto tablet:aspect-[4/3] tablet:max-h-none grid place-content-center justify-items-center gap-2 text-forest text-center font-bold">
          <PawIcon className="size-14 opacity-50" />{`Foto von ${e.tiername}`}<small className="font-medium opacity-70">Platzhalter – Foto folgt</small>
        </figure>
      )}
      <div className="pt-[clamp(8px,1.8vw,24px)] pr-[clamp(4px,1.8vw,24px)] pb-[clamp(8px,1.8vw,24px)] pl-0 tablet:pt-0 tablet:pr-[clamp(4px,2vw,16px)] tablet:pb-3 tablet:pl-[clamp(4px,2vw,16px)]">
        <h2 id="mc-name" className={`${DISPLAY} text-[clamp(2rem,4.2vw,3.3rem)] mb-[1.4rem] pr-16 tablet:pr-0 text-balance`}>
          {kopf.slice(0, pos)}<span className="marker marker--knapp marker--waechst" style={{ '--marker-delay': '1500ms' }}>{markiert}</span>{kopf.slice(pos + markiert.length)}
        </h2>
        <Letter einstieg={halloRest} brief={e.brief} werte={werte} />
        <p className={`mt-[2.2rem] mb-[1.2rem] mx-0 max-w-[34ch] ${HERVOR}`}><RichText text={e.appell} werte={werte} /></p>
        <div className="flex flex-wrap gap-2.5">
          <ButtonLink variante="red" groesse="lg" href="#spenden" onClick={onDauer} className="tablet:w-full" id="mc-donate">{e.button}</ButtonLink>
        </div>
      </div>
      <TrueLoveBadge ref={badgeRef} />
    </article>
  )
}
