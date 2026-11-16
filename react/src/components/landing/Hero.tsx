/* Hero der Startseite: Überschrift, Einleitung, Startknopf + Hunde-Slider */
import { Zeichen } from '../ui/RichText'
import { ButtonLink } from '../ui/Button'
import { PawIcon } from '../ui/icons'
import { Wrap } from '../ui/Wrap'
import { HeroSlider } from './HeroSlider'

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative overflow-clip bg-cream isolate" aria-labelledby="hero-title">
      <svg className="absolute inset-x-0 bottom-0 -z-1 w-full h-[58%] text-sand" viewBox="0 0 1440 520" preserveAspectRatio="none" aria-hidden="true"><path fill="currentColor" d="M0 120C180 40 360 30 560 120s400 170 600 120c120-30 200-90 280-150V520H0Z" /></svg>

      <Wrap className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-center gap-[clamp(24px,4vw,56px)] min-h-[min(calc(100svh-var(--header-h)),860px)] pt-[clamp(40px,6vh,72px)] pb-[clamp(28px,4vh,48px)] tablet:grid-cols-1 tablet:min-h-0 tablet:gap-1 tablet:pt-9">
        <div className="relative z-3 max-w-[560px]">
          <p className="inline-flex items-center gap-[.55em] m-0 mb-[1.1rem] font-head font-bold text-[.85rem] tracking-[.16em] uppercase text-forest" data-reveal>
            <PawIcon className="w-[1.4em] h-[1.4em] text-lime-600" />
            Hundequiz
            <PawIcon className="w-[1.4em] h-[1.4em] text-lime-600 rotate-[18deg]" />
          </p>
          <h1 id="hero-title" data-reveal style={{ '--d': '80ms' }} className="m-0 font-fun font-extrabold uppercase leading-[.98] tracking-[.005em] text-forest text-[clamp(2.6rem,5.6vw,4.9rem)] tablet:text-[clamp(2.3rem,10vw,3.8rem)]">
            <span className="block">Wer ist dein</span>
            <span className="block"><span className="marker marker--waechst">tierischer</span></span>
            <span className="block">Doppelgänger?</span>
          </h1>
          <p data-reveal style={{ '--d': '160ms' }} className="mt-[1.4rem] mb-[1.8rem] mx-0 max-w-[34rem] text-[clamp(1.15rem,1.7vw,1.4rem)] font-bold leading-[1.3] text-forest">
            Dickkopf, Wirbelwind oder treue Seele? <span className="block mt-2 text-[clamp(1.02rem,1.25vw,1.12rem)] font-normal leading-[1.5] text-pretty">In jedem von uns steckt ein bisschen Hund. Aber welcher Vierbeiner aus unserer Arche Noah tickt genauso wie du?</span>
          </p>
          <div data-reveal style={{ '--d': '240ms' }} className="flex flex-wrap items-center gap-y-4 gap-x-6">
            <ButtonLink groesse="lg" pfeil href="#quiz" onClick={onStart} className="phone:w-full">
              Jetzt starten
            </ButtonLink>
            <ul className="grid gap-0.5 m-0 p-0 list-none text-[.95rem] leading-[1.35]">
              <li className="flex items-center gap-[.4em]"><strong className="font-bold">5 Fragen · 6 Charaktere</strong></li>
              <li className="flex items-center gap-[.4em]">Ein tierisches Match! <Zeichen art="herz" /></li>
              <li className="flex items-center gap-[.4em]"><svg className="w-[1.05em] h-[1.05em] flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>Dauert nur 1 Minute</li>
            </ul>
          </div>
        </div>

        {/* -------- Hunde-Slider -------- */}
        <HeroSlider onStart={onStart} />
      </Wrap>
    </section>
  )
}
