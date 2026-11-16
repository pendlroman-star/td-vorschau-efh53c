/* Fußzeile (Start- und Ergebnisseite; kleine Unterschiede wie im Original) */
import { Wrap } from '../ui/Wrap'

const H3 = 'm-0 mb-[.7rem] font-head font-extrabold text-[.95rem] tracking-[.06em] uppercase'
const LISTE = 'm-0 p-0 list-none not-italic grid gap-[.35rem]'
const LINK = 'no-underline opacity-90 hover:opacity-100 hover:underline hover:underline-offset-3'

export function SiteFooter({ seite }: { seite: 'landing' | 'ergebnis' }) {
  const landing = seite === 'landing'
  return (
    <footer className="bg-forest text-cream pt-[clamp(44px,6vw,64px)] text-[.95rem]">
      <Wrap className="grid grid-cols-[repeat(4,auto)_1fr] tablet:grid-cols-2 phone:grid-cols-1 gap-y-7 gap-x-[clamp(28px,5vw,64px)] items-start pb-[clamp(36px,5vw,52px)]">
        <nav aria-labelledby="f-recht"><h3 id="f-recht" className={H3}>Rechtliches</h3><ul className={LISTE}><li><a className={LINK} href="#">Impressum</a></li><li><a className={LINK} href="#">Barrierefreiheit</a></li><li><a className={LINK} href="#">Datenschutzerklärung</a></li></ul></nav>
        <nav aria-labelledby="f-info"><h3 id="f-info" className={H3}>Informationen</h3><ul className={LISTE}><li><a className={LINK} href="#">Jetzt spenden</a></li><li><a className={LINK} href="#">Kontakt &amp; Öffnungszeiten</a></li><li><a className={LINK} href="#">Tierschutznachrichten</a></li></ul></nav>
        <div><h3 className={H3}>Adresse</h3><address className={LISTE}>Neufeldweg 211<br />8041 Graz<br />Österreich</address></div>
        <div><h3 className={H3}>Spendenkonto</h3><ul className={LISTE}><li>Aktiver Tierschutz Austria</li><li>IBAN AT71 3800 0000 0513 5025</li><li>BIC RZSTAT2G</li></ul></div>
        <div
          role="img"
          aria-label="Ihre Spende ist steuerlich absetzbar"
          className={`justify-self-end tablet:justify-self-start grid place-items-center text-center py-2.5 px-3.5 rounded-[10px] bg-cream text-forest font-head font-extrabold uppercase leading-none shadow-[0_0_0_3px_var(--color-forest),0_0_0_6px_var(--color-cream)] -rotate-3 ${landing ? 'border-3 border-cream' : ''}`}
        >
          <span className={`text-[.8rem] ${landing ? 'tracking-[.04em]' : ''}`}>Ihre Spende ist</span>
          <span className={`text-[1.45rem] ${landing ? 'tracking-[-.01em]' : ''}`}>steuerlich</span>
          <span className={`text-[1.45rem] ${landing ? 'tracking-[-.01em]' : ''}`}>absetzbar</span>
        </div>
      </Wrap>
      <div className="bg-cream text-forest">
        <Wrap className="flex flex-wrap items-center justify-between gap-y-2.5 gap-x-6 min-h-14 py-2.5 text-[.9rem]">
          <ul className="flex gap-[clamp(16px,5vw,64px)] m-0 p-0 list-none">
            {['Instagram', 'Facebook', 'Youtube'].map(n => (
              <li key={n}><a href="#" className={`no-underline font-medium ${landing ? 'hover:underline hover:underline-offset-3' : ''}`}>{n}</a></li>
            ))}
          </ul>
          <span className="font-head font-extrabold tracking-[.04em] uppercase">Gemeinsam stark für Tiere.</span>
          {landing && <small className="basis-full text-[.75rem] opacity-70">Hundebilder und -animationen: KI-generiert</small>}
        </Wrap>
      </div>
    </footer>
  )
}
