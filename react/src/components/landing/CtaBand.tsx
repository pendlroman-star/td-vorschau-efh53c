/* Grüner Balken über der Fußzeile mit rotem Knopf zum Quiz (Kundenwunsch 16.11.) */
import { Wrap } from '../ui/Wrap'

export function CtaBand({ onStart }: { onStart: () => void }) {
  return (
    <aside className="bg-lime py-[18px] text-center font-bold">
      <Wrap>Hast du deinen tierischen Doppelgänger schon gefunden? <a href="#quiz" onClick={onStart} className="inline-block ml-[.5em] py-[.45em] px-[1.1em] rounded-full bg-red text-white no-underline transition-colors duration-150 hover:bg-red-700">Jetzt Quiz starten</a></Wrap>
    </aside>
  )
}
