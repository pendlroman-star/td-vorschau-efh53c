/* Platzhalter in den Kundentexten (portiert aus daten.js) */

export interface TextWerte { name?: string; vorname?: string }

/** Platzhalter füllen: {name} = Name des Hundes, „{vorname}, " = Anrede (fehlt der Vorname, beginnt der Satz groß) */
export function textFuellen(text: string, { name = '', vorname = '' }: TextWerte = {}): string {
  return String(text)
    .replace(/\{name\}/g, name)
    .replace(/\{vorname\}, (\p{L})/gu, (_, b: string) => vorname ? `${vorname}, ${b}` : b.toUpperCase())
}

/** Vorname aus dem Formular – nur in dieser Sitzung gespeichert, nie in der Adresse */
export const VORNAME_KEY = 'tdg-vorname'
/** Merker „kommt direkt vom Quiz“ (Ergebnisseite öffnet sich mit Kreis-Übergang) */
export const ANKUNFT_KEY = 'tdg-ankunft'

export function merkeVorname(v: unknown): void {
  try { sessionStorage.setItem(VORNAME_KEY, String(v || '').trim().slice(0, 40)) } catch { /* privates Fenster o. Ä. */ }
}
export function leseVorname(): string {
  try { return (sessionStorage.getItem(VORNAME_KEY) || '').trim().slice(0, 40) } catch { return '' }
}
