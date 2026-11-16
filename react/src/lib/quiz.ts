/* Auswertung des Quiz (reine Funktionen, portiert aus index.html) */
import { HUNDE, type Hund, type HundId } from '../data/hunde'

/** Antworten je Durchlauf zufällig mischen – keine Rasse wird durch ihren Platz bevorzugt. */
export function mischen<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

/** Auswertung: 1 Punkt je Antwort. Bei Gleichstand entscheidet die späteste Frage,
    deren Antwort zu einer der führenden Rassen gehört (Frage 5, sonst 4, 3 …). */
export function sieger(answers: HundId[]): HundId {
  const punkte: Partial<Record<HundId, number>> = {}
  answers.forEach(id => { punkte[id] = (punkte[id] || 0) + 1 })
  const max = Math.max(...Object.values(punkte))
  for (let i = answers.length - 1; i >= 0; i--) if (punkte[answers[i]] === max) return answers[i]
  return HUNDE[0].id
}

export const ergebnisHund = (answers: HundId[]): Hund => HUNDE.find(h => h.id === sieger(answers))!

/** Echo-Zeile auf der Ergebnisseite: greift die späteste Antwort auf, die zur Sieger-Rasse gehört (Nummer der Frage, 1–5) */
export const echoFrage = (answers: HundId[]): number => answers.lastIndexOf(sieger(answers)) + 1
