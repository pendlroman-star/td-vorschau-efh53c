/* Startseite: Hero mit Hunde-Slider, Quiz, Zitat, FAQ, grüner Balken, Fußzeile */
import { useCallback, useRef } from 'react'
import { CtaBand } from '../components/landing/CtaBand'
import { Faq } from '../components/landing/Faq'
import { Hero } from '../components/landing/Hero'
import { Quiz, type QuizHandle } from '../components/landing/Quiz'
import { QuoteBand } from '../components/landing/QuoteBand'
import { SiteFooter } from '../components/layout/SiteFooter'
import { SiteHeader } from '../components/layout/SiteHeader'
import { useReveal } from '../hooks/useReveal'
import { reduce } from '../lib/env'

export function Landing() {
  const quiz = useRef<QuizHandle>(null)
  useReveal()
  // „Jetzt starten"-Links: zum Quiz (Sprungmarke #quiz) und erste Antwort fokussieren
  const onStart = useCallback(() => {
    setTimeout(() => quiz.current?.focusFirstAnswer(), reduce() ? 0 : 700)
  }, [])

  return (
    <>
      <a href="#quiz" className="absolute left-3 -top-[60px] focus:top-3 z-100 py-[.7em] px-[1.1em] rounded-[10px] bg-lime text-forest font-bold no-underline transition-[top] duration-200 ease-smooth">Direkt zum Quiz</a>
      <SiteHeader seite="landing" />
      <main>
        <Hero onStart={onStart} />
        <Quiz ref={quiz} />
        <QuoteBand />
        <Faq />
      </main>
      <CtaBand onStart={onStart} />
      <SiteFooter seite="landing" />
    </>
  )
}
