/* ------------------------------------------------------------------
   TEXTE MIT ZEICHEN (portiert aus textHTML() in daten.js)
   Die Kundentexte enthalten 🐾 und ❤️. Statt der Emojis (sehen auf jedem Gerät anders aus)
   setzt die Seite die Arche-Zeichen ein: Pfote in Grün, Herz in der Akzentfarbe Rot.
   ------------------------------------------------------------------ */
import { textFuellen, type TextWerte } from '../../lib/text'
import { HeartIcon, PawIcon } from './icons'

/** Größe der Zeichen: im Fließtext oder (kleiner) in der großen Überschrift der Ergebnisseite */
type ZeichenGroesse = 'text' | 'titel'
const GROESSE: Record<ZeichenGroesse, string> = {
  text: 'w-[1.05em] h-[1.05em] align-[-.16em]',
  titel: 'w-[.72em] h-[.72em] align-[-.02em]',
}

export function Zeichen({ art, groesse = 'text' }: { art: 'pfote' | 'herz'; groesse?: ZeichenGroesse }) {
  const cls = `inline-block ${GROESSE[groesse]}`
  return art === 'pfote'
    ? <PawIcon className={`${cls} text-lime-600`} />
    : <HeartIcon className={`${cls} text-red`} />
}

/** Text mit Platzhaltern und Zeichen. Das letzte Wort bleibt beim Zeichen am Absatzende
    (geschütztes Leerzeichen – kein einzelnes Wort mit Herz in der letzten Zeile). */
export function RichText({ text, werte, groesse }: { text: string; werte?: TextWerte; groesse?: ZeichenGroesse }) {
  const s = textFuellen(text, werte)
    .replace(/ (\S+ ?(?:🐾|❤️))$/u, ' $1')
    .replace(/ ?(🐾|❤️)/gu, ' $1')
  return s.split(/(🐾|❤️)/u).filter(Boolean).map((teil, i) =>
    teil === '🐾' ? <Zeichen key={i} art="pfote" groesse={groesse} />
      : teil === '❤️' ? <Zeichen key={i} art="herz" groesse={groesse} />
        : teil)
}
