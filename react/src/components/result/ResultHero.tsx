/* Ergebnis-Hero, Teil 1: „Dein Charakter“ (Rasse, Eigenschaften, Text, Echo-Zeile) + Bild */
import type { Ref } from 'react'
import type { Hund } from '../../data/hunde'
import { RichText } from '../ui/RichText'
import { DISPLAY } from '../ui/styles'
import { Wrap } from '../ui/Wrap'
import { ResultVisual } from './ResultVisual'

interface Props {
  h: Hund
  idx: number
  vorname: string
  echoNr: number
  ruhig: boolean
  natur: boolean
  innerRef: Ref<HTMLDivElement>
}

/** Echo-Zeile: das Zitat aus dem Quiz („…“) fett hervorheben */
function Echo({ text }: { text: string }) {
  const m = /„[^“]*“/.exec(text)
  if (!m) return text
  return <>{text.slice(0, m.index)}<strong className="font-bold">{m[0]}</strong>{text.slice(m.index + m[0].length)}</>
}

export function ResultHero({ h, idx, vorname, echoNr, ruhig, natur, innerRef }: Props) {
  const e = h.ergebnis
  return (
    <Wrap ref={innerRef} className="grid grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] tablet:grid-cols-1 items-center gap-[clamp(24px,4vw,64px)] pt-[clamp(36px,5vw,64px)] pb-[clamp(8px,2vw,24px)] tablet:pb-8">
      {/* 1) Dein Charakter */}
      <div>
        <p className="inline-block m-0 mb-4 py-[.35em] px-[.95em] rounded-full bg-forest text-lime font-bold text-[.9rem]" data-in>Dein Ergebnis</p>
        <h1 className={`${DISPLAY} text-[clamp(2.3rem,4.8vw,4rem)] text-balance`} id="r-title" data-in>
          {/* Persönliche Anrede: Vorname aus dem Formular (nur in dieser Sitzung gespeichert, nie in der Adresse) */}
          {vorname && <span className="block text-red">{vorname},</span>}
          {vorname ? 'in' : 'In'} dir steckt ein <span className="marker marker--zeilen">{h.name}.</span><RichText text=" 🐾" groesse="titel" />
        </h1>
        <ul className="flex flex-wrap gap-2 mt-[1.3rem] mb-[1.2rem] mx-0 p-0 list-none" aria-label="Deine Eigenschaften" data-in>
          {h.eigenschaften.slice(0, 4).map(t => <li key={t} className="py-[.35em] px-[.85em] rounded-full border-[1.5px] border-solid border-forest bg-white font-bold text-[.9rem]">{t}</li>)}
        </ul>
        <p className="m-0 max-w-[50ch] text-[clamp(1.08rem,1.35vw,1.2rem)] leading-[1.5] text-pretty" data-in>{e.charakter}</p>
        <p className="relative mt-[1.3rem] mb-0 mx-0 max-w-[50ch] py-[.85em] px-[1.1em] rounded-[4px_18px_18px_18px] bg-white shadow-sm text-base leading-[1.45]" data-in><Echo text={e.echo[echoNr - 1]} /></p>
      </div>
      <ResultVisual hund={h} idx={idx} ruhig={ruhig} natur={natur} />
    </Wrap>
  )
}
