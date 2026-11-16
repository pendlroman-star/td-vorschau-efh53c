/* ==================================================================
   QUIZ – fünf Fragen, dann Formular-Schritt, dann Übergang zur Ergebnisseite
   ------------------------------------------------------------------
   Ablauf wie im Original: Antwort wählen → 380 ms später weiche Überblendung
   zur nächsten Frage (alte Ansicht gleitet hinaus, neue herein, Antworten
   nacheinander). Tastatur-Bedienung nimmt den Fokus mit.
   ================================================================== */
import { useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type MouseEvent, type Ref } from 'react'
import type { HundId } from '../../data/hunde'
import { QUIZ } from '../../data/quiz'
import { reduce } from '../../lib/env'
import { play } from '../../lib/motion'
import { echoFrage, ergebnisHund, mischen } from '../../lib/quiz'
import { merkeVorname } from '../../lib/text'
import { DISPLAY_START } from '../ui/styles'
import { Wrap } from '../ui/Wrap'
import { Analysis } from './Analysis'
import { FormGate } from './FormGate'
import { QuizQuestion } from './QuizQuestion'
import { QuizSteps } from './QuizSteps'

export interface QuizHandle {
  /** „Jetzt starten“: erste Antwort fokussieren */
  focusFirstAnswer: () => void
}

const FORM = QUIZ.length   // Schritt-Nummer des Formulars

export function Quiz({ ref }: { ref?: Ref<QuizHandle> }) {
  // Beim Zurückblättern bleibt die Reihenfolge der Antworten gleich
  const [reihenfolge] = useState(() => QUIZ.map(q => mischen(Object.keys(q.antworten) as HundId[])))
  const [answers, setAnswers] = useState<HundId[]>([])   // gewählte Antwort je Frage = Kürzel der Rasse
  const [ansicht, setAnsicht] = useState(0)               // angezeigter Schritt (0–4 Fragen, 5 Formular)
  const [live, setLive] = useState('')
  const [analyse, setAnalyse] = useState<{ answers: HundId[]; von: DOMRect | null } | null>(null)
  const step = useRef(0)                                  // logischer Schritt (eilt der Anzeige während der Überblendung voraus)
  const wantFocus = useRef(false)                         // Tastatur → Fokus mitnehmen
  const answersRef = useRef<HundId[]>([])
  const view = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const einblenden = useRef<{ dir: number; focusSel: string } | null>(null)

  useImperativeHandle(ref, () => ({
    focusFirstAnswer: () => view.current?.querySelector<HTMLElement>('.answer')?.focus({ preventScroll: true }),
  }), [])

  // Weicher Wechsel zwischen den Schritten
  const swap = useCallback((ziel: number, dir: number, focusSel: string) => {
    step.current = ziel
    const old = view.current?.firstElementChild
    if (reduce() || !old) { einblenden.current = { dir: 0, focusSel }; setAnsicht(ziel); return }
    play(old, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-28 * dir}px)` }], { duration: 220, easing: 'cubic-bezier(.5, 0, .75, 0)' })
      .finished.then(() => { einblenden.current = { dir, focusSel }; setAnsicht(ziel) }).catch(() => {})
  }, [])

  // nach dem Rendern des neuen Schritts: scrollen, Fokus, Einblenden
  useLayoutEffect(() => {
    const e = einblenden.current
    if (!e) return                                         // erster Aufbau: nichts tun
    einblenden.current = null
    // Mit sechs Antworten ist der Kasten am Handy höher als der Bildschirm: nach der Wahl zurück zum Anfang der nächsten Frage
    const karte = card.current!
    if (karte.getBoundingClientRect().top < 0) karte.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' })
    // Fokus mitnehmen: bei Tastaturbedienung immer, beim Formular immer (Screenreader)
    const f = view.current?.querySelector<HTMLElement>(e.focusSel)
    if (f && (wantFocus.current || e.focusSel === '#gateTitle')) f.focus({ preventScroll: true })
    const neu = view.current?.firstElementChild
    if (!neu || !e.dir) return
    play(neu, [{ opacity: 0, transform: `translateX(${36 * e.dir}px)` }, { opacity: 1, transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'none' })
    neu.querySelectorAll('.answer').forEach((a, n) => play(a, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 80 + n * 60, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards' }))
  }, [ansicht])

  const showQuestion = useCallback((i: number, dir = 1) => {
    swap(i, dir, '#qTitle')
    setLive(`Frage ${i + 1} von ${QUIZ.length}: ${QUIZ[i].frage}`)
  }, [swap])

  const showForm = useCallback(() => {
    swap(FORM, 1, '#gateTitle')
    setLive('Wuff! Wir haben deinen tierischen Doppelgänger gefunden. Trage deine Daten ein, um dein Ergebnis zu bekommen.')
    setTimeout(() => { if (!wantFocus.current) return; view.current?.querySelector<HTMLElement>('#gAnrede')?.focus({ preventScroll: true }) }, reduce() ? 0 : 300)
  }, [swap])

  function onAntwort(k: HundId, e: MouseEvent<HTMLButtonElement>) {
    const neu = answersRef.current.slice(0, step.current)
    neu[step.current] = k
    answersRef.current = neu
    setAnswers(neu)
    wantFocus.current = e.detail === 0   // Tastatur → Fokus mitnehmen
    const at = step.current
    setTimeout(() => { if (step.current !== at) return; if (at + 1 < QUIZ.length) showQuestion(at + 1, 1); else showForm() }, reduce() ? 0 : 380)
  }

  function onZurueck(e: MouseEvent<HTMLButtonElement>) {
    wantFocus.current = e.detail === 0
    // „Zurück" steht bei jeder Frage; bei Frage 1 führt es zurück zum Anfang der Seite
    if (step.current === 0) scrollTo({ top: 0, behavior: reduce() ? 'auto' : 'smooth' })
    else showQuestion(step.current - 1, -1)
  }

  /* ---------- Übergang: „Dein Doppelgänger wird analysiert …" ---------- */
  const analyseStarten = useCallback((von: Element | null) => {
    setAnalyse(a => a ?? { answers: answersRef.current, von: (von ?? view.current)?.getBoundingClientRect() ?? null })
  }, [])

  useEffect(() => {
    // Beim Zurückblättern vom Ergebnis den Übergang wieder entfernen
    const onPageshow = (e: PageTransitionEvent) => { if (e.persisted) setAnalyse(null) }
    // Echtes Formular (iframe) meldet „gesendet" – optional mit Vornamen:
    // parent.postMessage({ type: 'tdg:formular-gesendet', vorname: 'Maria' }, '*')
    const onMessage = (e: MessageEvent) => {
      const d = e.data as { type?: string; vorname?: string } | null
      if (!d || d.type !== 'tdg:formular-gesendet') return
      if (d.vorname) merkeVorname(d.vorname)
      analyseStarten(view.current?.querySelector('.form-slot') ?? null)
    }
    addEventListener('pageshow', onPageshow)
    addEventListener('message', onMessage)
    return () => { removeEventListener('pageshow', onPageshow); removeEventListener('message', onMessage) }
  }, [analyseStarten])

  return (
    <section className="relative pt-[clamp(64px,9vw,112px)] pb-[clamp(72px,10vw,120px)] overflow-clip" id="quiz" aria-labelledby="quiz-title">
      <Wrap>
        <div className="text-center max-w-[720px] mx-auto mb-[clamp(28px,4vw,44px)]" data-reveal>
          <h2 className={`${DISPLAY_START} text-[clamp(2.1rem,4.4vw,3.3rem)]`} id="quiz-title">Dein <span className="marker">Hundequiz</span></h2>
          <p className="mt-[.8rem] mb-0 text-[1.1rem]">Mit nur fünf Fragen erfährst du, wer dein tierischer Doppelgänger ist.</p>
        </div>

        <div data-reveal ref={card} className="relative max-w-[1040px] mx-auto rounded-[28px] bg-cream border border-solid border-forest/8 shadow-[0_1px_2px_rgba(13,58,32,.05),0_24px_60px_-28px_rgba(13,58,32,.35)] overflow-hidden before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-1.5 before:bg-lime">
          <div className="relative pt-[clamp(26px,4vw,52px)] px-[clamp(18px,4.5vw,56px)] pb-[clamp(26px,4vw,48px)] min-h-[480px]">
            <QuizSteps step={ansicht} />
            <div id="quizView" aria-live="off" ref={view}>
              {ansicht < FORM
                ? <QuizQuestion key={ansicht} i={ansicht} reihenfolge={reihenfolge[ansicht]} gewaehlt={answers[ansicht]} onAntwort={onAntwort} onZurueck={onZurueck} />
                : <FormGate key="form" hund={ergebnisHund(answers)} onGesendet={analyseStarten} />}
            </div>
            <p className="visually-hidden" aria-live="polite" id="quizLive">{live}</p>
          </div>
        </div>
      </Wrap>
      {analyse && <Analysis hund={ergebnisHund(analyse.answers)} echo={echoFrage(analyse.answers)} von={analyse.von} />}
    </section>
  )
}
