/* Vorschau des Spendenformulars (Nachbildung) – nur abseits der Live-Seite, es wird nichts gesendet.
   Betragsvorschläge 10/18/25 €, 18 € vorgewählt (Kundenwunsch 16.11.). */
import { useState } from 'react'
import './donationPreviewForm.css'

const BETRAEGE = [10, 18, 25]
const ZAHLUNG = [['mc', 'Mastercard'], ['pp', 'PayPal'], ['visa', 'VISA'], ['sepa', 'SEPA']] as const

const Herz = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20s-7.5-4.6-8.8-9.2C2.4 7.7 4.4 5 7.2 5c2 0 3.6 1.2 4.8 3 1.2-1.8 2.8-3 4.8-3 2.8 0 4.8 2.7 4 5.8C19.5 15.4 12 20 12 20z" /></svg>
)

interface Props {
  /** Häufigkeit – „Jetzt monatlich helfen“-Knöpfe setzen sie auf „monatlich“ */
  freq: string
  onFreq: (f: string) => void
}

export function DonationPreviewForm({ freq, onFreq }: Props) {
  const [betrag, setBetrag] = useState('18')
  const [zahlung, setZahlung] = useState<string | null>(null)
  const [meldung, setMeldung] = useState('')
  return (
    <form className="fso" noValidate aria-label="Spendenformular (Vorschau)" onSubmit={e => { e.preventDefault(); setMeldung('Vorschau – im Prototyp wird nichts gesendet.') }}>
      <h3>Gleich spenden und sofort helfen</h3>
      <div className="fso__amounts" role="group" aria-label="Betrag">
        {BETRAEGE.map(b => (
          <button key={b} type="button" className="fso__amount" aria-pressed={String(b) === betrag.trim()} onClick={() => setBetrag(String(b))}><Herz />{b} €</button>
        ))}
        <div className="fso__custom"><span>€</span><input type="text" inputMode="numeric" value={betrag} onChange={e => setBetrag(e.target.value)} aria-label="Anderer Betrag in Euro" /></div>
      </div>
      <label htmlFor="f-freq">Wie häufig möchten Sie diesen Betrag spenden?</label>
      <select id="f-freq" value={freq} onChange={e => onFreq(e.target.value)}><option>einmalig</option><option>monatlich</option><option>jährlich</option></select>
      <p className="fso__h">Meine Daten</p>
      <p className="fso__hint">Mit * gekennzeichnete Felder sind Pflichtfelder.</p>
      <div className="fso__row fso__row--2">
        <div><label htmlFor="f-anrede">Anrede*</label><select id="f-anrede" defaultValue=""><option></option><option>Frau</option><option>Herr</option><option>Divers</option></select></div>
        <div><label htmlFor="f-titel">Titel</label><input id="f-titel" type="text" placeholder="Ing." /></div>
      </div>
      <div className="fso__row"><div><label htmlFor="f-vn">Vorname*</label><input id="f-vn" type="text" placeholder="Maria" autoComplete="given-name" /></div></div>
      <div className="fso__row"><div><label htmlFor="f-nn">Nachname*</label><input id="f-nn" type="text" placeholder="Muster" autoComplete="family-name" /></div></div>
      <div className="fso__row"><div><label htmlFor="f-em">Email*</label><input id="f-em" type="email" placeholder="maria.muster@muster.at" autoComplete="email" /></div></div>
      <div className="fso__row"><div><label htmlFor="f-gb">Geburtsdatum</label><p className="fso__hint">Um Ihre Spenden von der Steuer absetzen zu können, ist die Angabe Ihres Geburtsdatums erforderlich.</p><input id="f-gb" type="text" placeholder="07.02.1989" /></div></div>
      <div className="fso__row fso__row--3">
        <div><label htmlFor="f-str">Strasse</label><input id="f-str" type="text" placeholder="Musterstraße" autoComplete="address-line1" /></div>
        <div><label htmlFor="f-hnr">Hausnummer</label><input id="f-hnr" type="text" /></div>
        <div><label htmlFor="f-plz">PLZ</label><input id="f-plz" type="text" placeholder="1070" autoComplete="postal-code" /></div>
      </div>
      <div className="fso__row fso__row--2">
        <div><label htmlFor="f-ort">Ort</label><input id="f-ort" type="text" placeholder="Wien" autoComplete="address-level2" /></div>
        <div><label htmlFor="f-land">Land*</label><select id="f-land" defaultValue="Österreich"><option>Deutschland</option><option>Frankreich</option><option>Italien</option><option>Österreich</option><option>Schweiz</option><option>Slowakei</option><option>Slowenien</option><option>Tschechische Republik</option></select></div>
      </div>
      <label className="fso__check"><input type="checkbox" /> Ja, ich möchte den regelmäßigen Newsletter der Arche Noah erhalten.</label>
      <label className="fso__check"><input type="checkbox" /> <span>Ich nehme die <a href="#">Datenschutzbestimmungen</a> zur Kenntnis und erkläre mich damit einverstanden.*</span></label>
      <p className="fso__h" style={{ fontSize: 14, marginTop: 22 }}>Bitte Zahlungsweise wählen:</p>
      <div className="fso__pay" role="group" aria-label="Zahlungsweise">
        {ZAHLUNG.map(([k, name]) => <button key={k} type="button" className={k} aria-pressed={zahlung === k} onClick={() => setZahlung(k)}>{name}</button>)}
      </div>
      <button type="submit" className="fso__submit">Jetzt spenden</button>
      <p className="fso__msg" role="status">{meldung}</p>
    </form>
  )
}
