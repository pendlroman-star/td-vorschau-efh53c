/* Grüner Zitat-Balken (Charles Darwin) mit Knochen und Schnörkel */
import { Wrap } from '../ui/Wrap'

const DOODLE = '[&_path]:[stroke-dasharray:1] [&_path]:fill-none [&_path]:stroke-current [&_path]:stroke-[2.5] [&_path]:[stroke-linecap:round] [&_path]:[stroke-linejoin:round]'

export function QuoteBand() {
  return (
    <section className="relative bg-forest text-cream py-[clamp(48px,7vw,80px)] overflow-clip" aria-label="Zitat">
      <svg className={`absolute pointer-events-none text-cream w-12 left-[12%] top-1/2 -translate-y-1/2 -rotate-30 tablet:left-[4%] tablet:top-[18%] ${DOODLE}`} viewBox="0 0 48 48" aria-hidden="true"><path d="M14.3 30.2l15.9-15.6c-1.3-2.5-.6-5.7 1.9-7 2.3-1.2 5.1-.3 6.1 2 .4.8.6 1.7.4 2.6 1-.3 2-.2 2.9.2 2.3 1.1 3 4 1.6 6.2-1.4 2.2-4.4 2.7-6.6 1.3L20.6 35.6c1.3 2.5.6 5.6-1.9 6.9-2.3 1.2-5.1.3-6.1-2-.4-.8-.5-1.7-.4-2.5-1 .3-2 .2-2.9-.2-2.3-1.1-3-4-1.6-6.2 1.4-2.2 4.4-2.7 6.6-1.4z" /></svg>
      <svg className={`absolute pointer-events-none text-cream w-[30px] right-[14%] top-1/2 -translate-y-[40%] tablet:right-[5%] tablet:top-[80%] ${DOODLE}`} viewBox="0 0 30 64" aria-hidden="true"><path d="M22 4c-6 4-12 14-10 24 1 5 6 6 8 2s-3-10-8-6-6 14-4 22 4 12 2 16" /></svg>
      <Wrap>
        <blockquote data-reveal className="m-0 mx-auto max-w-[760px] text-center">
          <p className="m-0 font-fun font-semibold text-[clamp(1.45rem,2.8vw,2.15rem)] leading-[1.25] text-balance">„Die Tiere empfinden wie der Mensch Freude und Schmerz, Glück und Unglück.“</p>
          <footer className="mt-[.9rem] text-[.9rem] tracking-[.08em] uppercase opacity-75">Charles Darwin</footer>
        </blockquote>
      </Wrap>
    </section>
  )
}
