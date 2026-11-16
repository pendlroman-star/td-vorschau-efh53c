/* Der Brief des Hundes: Absätze der Reihe nach; aufeinanderfolgende Wunsch-Zeilen bilden einen Block */
import type { ReactNode } from 'react'
import type { BriefArt } from '../../data/hunde'
import type { TextWerte } from '../../lib/text'
import { RichText } from '../ui/RichText'

/** Hervorhebung (Wunsch des Hundes und Bitte) */
export const HERVOR = 'font-bold text-[clamp(1.2rem,1.9vw,1.5rem)] leading-[1.3] text-balance'

interface Props {
  /** zweiter Satz der Begrüßung (erster Absatz) */
  einstieg: string
  brief: [BriefArt, string][]
  werte: TextWerte
}

export function Letter({ einstieg, brief, werte }: Props) {
  const teile: ReactNode[] = []
  if (einstieg) teile.push(<p key="einstieg" className="m-0 mb-4 text-pretty">{einstieg}</p>)
  let wunsch: ReactNode[] | null = null
  brief.forEach(([art, text], i) => {
    if (art === 'wunsch') {
      if (!wunsch) {
        wunsch = []
        teile.push(
          <div key={`w${i}`} className="relative m-0 mb-6 py-[.35rem] pr-0 pl-[1.3rem] tablet:pl-4 before:content-[''] before:absolute before:left-0 before:top-[.15em] before:bottom-[.15em] before:w-[5px] before:rounded-full before:bg-lime">{wunsch}</div>,
        )
      }
      // kein Absatzabstand: alle Zeilen des Wunsches stehen im selben Zeilenabstand
      wunsch.push(<p key={i} className={`m-0 ${HERVOR} tablet:text-pretty`}><RichText text={text} werte={werte} /></p>)
      return
    }
    wunsch = null
    // „frage“ leitet den Wunsch ein: nur Abstand, keine eigene Auszeichnung
    teile.push(<p key={i} className={art === 'frage' ? 'mt-[1.9rem] mb-[.6rem] mx-0 text-pretty' : 'm-0 mb-4 text-pretty'}><RichText text={text} werte={werte} /></p>)
  })
  return <div className="max-w-[56ch] text-[clamp(1.05rem,1.4vw,1.125rem)]">{teile}</div>
}
