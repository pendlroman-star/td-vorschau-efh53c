/* Formular-Schritt („Wuff! Wir haben deinen tierischen Doppelgänger gefunden!“).
   Solange CONFIG.formularUrl leer ist, zeigt die Seite einen Platzhalter, der wie das spätere
   Formular aussieht. Mit Adresse wird stattdessen das iframe eingebunden; das Ergebnis geht
   als ?hund=… mit. Nach dem Absenden muss das Formular der Seite Bescheid geben:
   parent.postMessage({ type: 'tdg:formular-gesendet', vorname }, '*')   (siehe Quiz.tsx) */
import { useState, type FormEvent } from 'react'
import { CONFIG } from '../../data/config'
import type { Hund } from '../../data/hunde'
import { merkeVorname } from '../../lib/text'
import { Button } from '../ui/Button'
import { RichText } from '../ui/RichText'
import { DISPLAY_START } from '../ui/styles'
import './formGate.css'

const LABEL = 'block m-0 mb-1 text-[.88rem] font-bold'
const CHECK = 'flex items-start gap-2.5 w-full max-w-[460px] text-left text-[.9rem] leading-[1.4] cursor-pointer'
const CHECKBOX = 'flex-none size-5 m-0 mt-px accent-forest cursor-pointer'

const FELDER: [name: string, text: string][] = [
  ['anrede', 'Bitte wähle eine Anrede.'],
  ['vorname', 'Bitte gib deinen Vornamen ein.'],
  ['nachname', 'Bitte gib deinen Nachnamen ein.'],
  ['email', 'Bitte gib eine gültige E-Mail-Adresse ein.'],
]

interface Props {
  hund: Hund
  /** gültig abgeschickt → Übergang starten (vom Absende-Knopf aus) */
  onGesendet: (von: HTMLElement) => void
}

export function FormGate({ hund, onGesendet }: Props) {
  const [fehler, setFehler] = useState<{ feld: string; text: string } | null>(null)
  const url = CONFIG.formularUrl
  const invalid = (name: string) => fehler?.feld === name ? { 'aria-invalid': true, 'aria-describedby': 'gFehler' } as const : {}

  // Platzhalter-Formular: prüfen, dann Übergang starten
  function absenden(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const feld = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement
    const melde = (f: HTMLElement & { name: string }, text: string) => { setFehler({ feld: f.name, text }); f.focus() }
    for (const [name, text] of FELDER) {
      const f = feld(name)
      if (!f.value.trim() || !f.checkValidity()) return melde(f, text)
    }
    const ds = feld('datenschutz') as HTMLInputElement
    if (!ds.checked) return melde(ds, 'Bitte stimme den Datenschutzbestimmungen zu.')
    setFehler(null)
    merkeVorname(feld('vorname').value)
    onGesendet(form.querySelector<HTMLElement>('[type="submit"]')!)
  }

  return (
    <div className="max-w-[560px] mx-auto text-center pt-1 pb-1.5">
      <p className={`${DISPLAY_START} text-[clamp(2.6rem,6vw,3.6rem)]`}>Wuff!</p>
      <h3 className="mt-[.2rem] mx-auto mb-[.6rem] max-w-[30ch] font-head font-extrabold text-[clamp(1.3rem,2.4vw,1.75rem)] leading-[1.15] uppercase tracking-[.01em] outline-none text-balance" id="gateTitle" tabIndex={-1}>Wir haben deinen tierischen Doppelgänger gefunden!</h3>
      <p className="mt-0 mx-auto mb-[.5rem] max-w-[42ch]">Und ihr zwei habt mehr gemeinsam, als du vielleicht denkst.</p>
      <p className="mt-0 mx-auto mb-[1.4rem] max-w-[42ch] font-bold"><RichText text="Neugierig? Dann trage hier deine Daten ein! 🐾" /></p>
      <div className="form-slot relative">
        {url ? (
          <iframe className="block w-full min-h-[340px] border-0 rounded-xl bg-transparent" src={`${url}${url.includes('?') ? '&' : '?'}hund=${hund.id}`} title="Anmeldung, um dein Ergebnis zu sehen" loading="lazy" />
        ) : (
          <form className="grid gap-3 justify-items-center" noValidate onSubmit={absenden}>
            <div className="grid grid-cols-2 phone:grid-cols-1 gap-y-3 gap-x-3.5 w-full max-w-[460px] text-left">
              <div><label className={LABEL} htmlFor="gAnrede">Anrede*</label>
                <select className="gate-feld" id="gAnrede" name="anrede" autoComplete="honorific-prefix" required {...invalid('anrede')}><option value="">Bitte wählen</option><option>Frau</option><option>Mann</option><option>Divers</option></select></div>
              <div aria-hidden="true" className="phone:hidden" />
              <div><label className={LABEL} htmlFor="gVorname">Vorname*</label><input className="gate-feld" id="gVorname" name="vorname" autoComplete="given-name" autoCapitalize="words" required {...invalid('vorname')} /></div>
              <div><label className={LABEL} htmlFor="gNachname">Nachname*</label><input className="gate-feld" id="gNachname" name="nachname" autoComplete="family-name" autoCapitalize="words" required {...invalid('nachname')} /></div>
              <div className="col-span-full"><label className={LABEL} htmlFor="gMail">E-Mail-Adresse*</label><input className="gate-feld" id="gMail" type="email" name="email" autoComplete="email" inputMode="email" autoCapitalize="off" spellCheck={false} placeholder="maria.muster@beispiel.at" required {...invalid('email')} /></div>
              <div className="col-span-full"><label className={LABEL} htmlFor="gTel">Telefonnummer</label><input className="gate-feld" id="gTel" type="tel" name="telefon" autoComplete="tel" inputMode="tel" /></div>
            </div>
            <label className={CHECK}><input className={CHECKBOX} type="checkbox" name="newsletter" /><span>Ja, ich möchte den Newsletter der Arche Noah erhalten. <small>(optional)</small></span></label>
            <label className={CHECK}><input className={CHECKBOX} type="checkbox" name="datenschutz" required {...invalid('datenschutz')} /><span>Ich habe die <a href="#" className="underline-offset-2">Datenschutzbestimmungen</a> gelesen und stimme zu.*</span></label>
            <p className="m-0 max-w-[460px] w-full text-left text-[.8rem] opacity-75">* Pflichtfeld</p>
            <p className="min-h-[1.3em] m-0 text-[.9rem] font-bold text-red-700" id="gFehler" role="alert">{fehler?.text ?? ''}</p>
            <Button type="submit" groesse="lg" pfeil className="mt-0.5">Ergebnis bekommen</Button>
          </form>
        )}
      </div>
    </div>
  )
}
