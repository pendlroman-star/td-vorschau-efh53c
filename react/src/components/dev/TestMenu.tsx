/* ==================================================================
   TESTMENÜ – NUR TESTSEITE, VOR DEM LIVEGANG ENTFERNEN.
   Ergebnisse, Echo-Zeile und Variante „Natur“ umschalten. Erscheint nie auf
   *.aktivertierschutz.at (siehe Result.tsx).
   ================================================================== */
import { useEffect, useRef } from 'react'
import { HUNDE, type HundId } from '../../data/hunde'

const LINK = 'py-[5px] px-2.5 rounded-full border-[1.5px] border-solid border-forest no-underline font-bold'
const KEY = 'tdg-testmenue'

export function TestMenu({ hund, echoNr, natur }: { hund: HundId; echoNr: number; natur: boolean }) {
  const ref = useRef<HTMLDetailsElement>(null)
  const url = (h: string, echo = echoNr) => `ergebnis.html?hund=${h}&echo=${echo}${natur ? '&stil=natur' : ''}`
  // offen lassen, wenn man gerade darüber umgeschaltet hat
  useEffect(() => {
    try { if (sessionStorage.getItem(KEY) === '1' && ref.current) ref.current.open = true } catch { /* egal */ }
  }, [])
  const onToggle = () => { try { sessionStorage.setItem(KEY, ref.current?.open ? '1' : '0') } catch { /* egal */ } }
  const cls = (aktiv: boolean) => `${LINK} ${aktiv ? 'bg-forest text-cream' : 'text-forest'}`
  return (
    <details ref={ref} onToggle={onToggle} className="fixed left-3 bottom-3 z-90 max-w-[calc(100vw-24px)] text-[.82rem]">
      <summary className="inline-flex items-center gap-1.5 py-2 px-3 rounded-full bg-forest text-cream font-bold cursor-pointer list-none shadow-lg [&::-webkit-details-marker]:hidden">Testansicht</summary>
      <div className="mt-2 p-3 rounded-[14px] bg-white shadow-lg grid gap-2">
        <p className="m-0 font-bold opacity-70">Ergebnis</p>
        <div className="flex flex-wrap gap-1.5">
          {HUNDE.map(x => <a key={x.id} href={url(x.id)} aria-current={x.id === hund} className={cls(x.id === hund)}>{x.name.replace(' Terrier', '').replace(' Retriever', '')}</a>)}
        </div>
        <p className="m-0 font-bold opacity-70">Echo-Zeile zu Frage</p>
        <div className="flex flex-wrap gap-1.5">
          {[1, 2, 3, 4, 5].map(n => <a key={n} href={url(hund, n)} aria-current={n === echoNr} className={cls(n === echoNr)}>{n}</a>)}
        </div>
      </div>
    </details>
  )
}
