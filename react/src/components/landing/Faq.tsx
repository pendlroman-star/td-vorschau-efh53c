/* Fragen zum Quiz – Antworttexte = Vorschläge, bitte freigeben lassen */
import { ChevronIcon } from '../ui/icons'
import { Wrap } from '../ui/Wrap'
import './faq.css'

const FRAGEN: [frage: string, antwort: string][] = [
  ['Was erfahre ich, wenn ich das Quiz mache?', 'Nach fünf kurzen Fragen zeigen wir dir, welcher von sechs Hunde-Charakteren am besten zu dir passt – vom loyalen Schäferhund bis zum lebensfrohen Havaneser. Dann stellen wir dir einen Hund aus unserem Tierheim vor, der genauso tickt wie du.'],
  ['Warum soll ich das Quiz machen?', 'Weil es Spaß macht – und weil jeder Hund eine eigene Persönlichkeit hat, genau wie wir. Das Quiz zeigt spielerisch, wie unterschiedlich Hunde sind. Vielleicht entdeckst du dabei sogar deinen echten Doppelgänger, der bei uns auf ein Zuhause wartet.'],
  ['Wer steht hinter dem Quiz?', 'Die Arche Noah – Aktiver Tierschutz Austria in Graz. Wir kümmern uns um Tiere in Not, vermitteln sie in ein neues Zuhause und setzen uns für den Tierschutz ein.'],
  ['Bekomme ich nach dem Quiz weitere Informationen?', 'Ja. Wenn du deine E-Mail-Adresse angibst, erzählen wir dir in den nächsten Tagen mehr über deinen Doppelgänger, über unsere Arbeit und darüber, wie du echten Tierschutz unterstützen kannst. Abmelden kannst du dich jederzeit.'],
]

export function Faq() {
  return (
    <section className="py-[clamp(64px,9vw,112px)]" id="faq" aria-labelledby="faq-title">
      <Wrap schmal>
        <h2 id="faq-title" data-reveal className="m-0 mb-[1.4rem] font-head font-extrabold text-[clamp(1.7rem,3.2vw,2.4rem)] uppercase tracking-[.01em] leading-[1.1]">Fragen zum tierischen Quiz?</h2>
        <div className="grid gap-3">
          {FRAGEN.map(([frage, antwort], i) => (
            // name="faq": immer nur eine Antwort offen
            <details key={i} name="faq" data-reveal style={i ? { '--d': `${i * 60}ms` } : undefined} className="faq-item border-2 border-solid border-forest rounded-xl bg-paper open:bg-cream open:shadow-sm [transition:background-color_250ms,box-shadow_300ms_var(--ease-smooth)]">
              <summary className="flex items-center justify-between gap-4 py-[1em] px-[1.2em] cursor-pointer font-bold text-[1.02rem]">
                {frage}<ChevronIcon className="flex-none size-[22px] transition-transform duration-400 ease-spring" />
              </summary>
              <p className="pt-0 px-[1.2em] pb-[1.2em] m-0 max-w-[68ch]">{antwort}</p>
            </details>
          ))}
        </div>
      </Wrap>
    </section>
  )
}
