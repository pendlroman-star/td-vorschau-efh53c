/* Kopfzeile. Startseite: Logo springt zum Seitenanfang, beim Scrollen leicht durchscheinend.
   Ergebnisseite: Logo bewusst ohne Link (Spendenseite – niemand soll versehentlich wegklicken). */
import { useScrolled } from '../../hooks/useScrolled'
import { imIframe, istTestSeite } from '../../lib/env'
import { ButtonLink } from '../ui/Button'
import { DeviceSwitch } from '../dev/DeviceSwitch'

export function SiteHeader({ seite }: { seite: 'landing' | 'ergebnis' }) {
  const scrolled = useScrolled()
  const landing = seite === 'landing'
  const scrolledCls = landing
    ? 'bg-forest/92 backdrop-saturate-[1.4] backdrop-blur-[12px] shadow-[0_10px_30px_-18px_rgba(0,0,0,.55)]'
    : 'bg-forest shadow-[0_10px_30px_-18px_rgba(0,0,0,.55)]'
  const logoCls = 'block w-[clamp(150px,18vw,215px)] h-auto'
  return (
    <header
      id={landing ? 'top' : undefined}
      className={`sticky top-0 z-50 ${landing ? '[transition:box-shadow_300ms_var(--ease-smooth),background-color_300ms]' : '[transition:box-shadow_300ms_var(--ease-smooth)]'} ${scrolled ? scrolledCls : 'bg-forest'}`}
    >
      <div className="wrap max-w-[1200px] relative flex items-center justify-between gap-4 h-(--header-h)">
        {landing ? (
          <a href="#top" aria-label="Arche Noah – Aktiver Tierschutz Austria, zum Seitenanfang">
            <img src="bilder/logo-offwhite.svg" alt="" width="215" height="48" className={logoCls} />
          </a>
        ) : (
          <span><img src="bilder/logo-offwhite.svg" alt="Arche Noah – Aktiver Tierschutz Austria" width="215" height="48" className={logoCls} /></span>
        )}
        {/* Nur „Über uns“ (Vertrauen) – öffnet die Kontaktseite in neuem Tab, die Landingpage bleibt offen */}
        <nav className="flex gap-2.5" aria-label="Hauptnavigation">
          <ButtonLink variante="ghost" groesse="sm" href="https://www.aktivertierschutz.at/oeffnungszeiten-und-kontakt/" target="_blank" rel="noopener">
            Über uns<span className="visually-hidden"> (öffnet in neuem Fenster)</span>
          </ButtonLink>
        </nav>
        {/* NUR TESTSEITE – vor dem Livegang entfernen */}
        {istTestSeite() && !imIframe() && <DeviceSwitch />}
      </div>
    </header>
  )
}
