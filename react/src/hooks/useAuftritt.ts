/* Auftritt der Ergebnisseite (portiert aus auftritt() in ergebnis.html, Zeiten unverändert):
   Text der Reihe nach, Bild federt herein, Icons ploppen auf, Karte schiebt sich herein,
   Siegel ploppt auf; untere Abschnitte beim Scrollen. Nach dem Quiz öffnet sich zusätzlich
   die Creme-Fläche als Kreis zum Bild hin. */
import { useLayoutEffect, type RefObject } from 'react'

interface Refs {
  heroInner: RefObject<HTMLElement | null>
  visual: () => HTMLElement | null
  card: RefObject<HTMLElement | null>
  badge: RefObject<HTMLElement | null>
}

export function useAuftritt({ heroInner, visual, card, badge }: Refs, { ruhig, ankunft }: { ruhig: boolean; ankunft: boolean }): void {
  useLayoutEffect(() => {
    const items = [...document.querySelectorAll<HTMLElement>('[data-in]')]
    if (ruhig) { items.forEach(el => { el.style.opacity = '1' }); return }
    const anims: Animation[] = []
    const a = (el: Element | null | undefined, k: Keyframe[], o: KeyframeAnimationOptions) => { if (el) anims.push(el.animate(k, o)) }
    const startDelay = ankunft ? 250 : 0
    const vis = visual()
    // Charakter: Text der Reihe nach
    items.filter(el => heroInner.current?.contains(el) && el !== vis).forEach((el, n) =>
      a(el, [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }],
        { duration: 700, delay: startDelay + 150 + n * 90, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both' }))
    // Bild federt herein (wie der Hund im Slider)
    a(vis, [
      { opacity: 0, transform: 'translate3d(8%, 3%, 0) rotate(5deg) scale(.88)' },
      { opacity: 1, transform: 'translate3d(-1%, -1%, 0) rotate(-1deg) scale(1.02)', offset: .65 },
      { opacity: 1, transform: 'none' },
    ], { duration: 1100, delay: startDelay, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both' })
    // Icons ploppen nacheinander federnd auf
    vis?.querySelectorAll('.icon-pop').forEach((p, n) =>
      a(p, [
        { opacity: 0, transform: 'scale(.3) rotate(-18deg)' },
        { opacity: 1, transform: 'scale(1.12) rotate(4deg)', offset: .6 },
        { opacity: 1, transform: 'none' },
      ], { duration: 640, delay: startDelay + 800 + n * 130, easing: 'cubic-bezier(.34, 1.4, .64, 1)', fill: 'both' }))
    // Danach: der echte Hund – Karte schiebt sich herein, Plakette ploppt auf
    a(card.current, [{ opacity: 0, transform: 'translateY(40px) scale(.98)' }, { opacity: 1, transform: 'none' }],
      { duration: 900, delay: startDelay + 900, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both' })
    a(badge.current, [{ transform: 'scale(0) rotate(-40deg)' }, { transform: 'scale(1.08) rotate(6deg)', offset: .7 }, { transform: 'none' }],
      { duration: 800, delay: startDelay + 1500, easing: 'cubic-bezier(.34, 1.4, .64, 1)', fill: 'both' })
    // Unterer Abschnitt beim Scrollen
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return
      a(en.target, [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], { duration: 800, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both' })
      io.unobserve(en.target)
    }), { threshold: .15 })
    document.querySelectorAll('section[aria-labelledby="m-title"] [data-in], #spenden [data-in]').forEach(el => io.observe(el))
    // Nach dem Quiz: Creme-Fläche öffnet sich als Kreis zum Bild hin
    let arrival: HTMLDivElement | null = null
    if (ankunft && vis) {
      arrival = document.createElement('div')
      arrival.className = 'fixed inset-0 z-100 bg-cream pointer-events-none'
      document.body.appendChild(arrival)
      const r = vis.getBoundingClientRect()
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2
      const el = arrival
      el.animate([{ clipPath: `circle(150vmax at ${cx}px ${cy}px)` }, { clipPath: `circle(0px at ${cx}px ${cy}px)` }],
        { duration: 800, easing: 'cubic-bezier(.65, 0, .35, 1)', fill: 'both' }).finished.then(() => el.remove()).catch(() => {})
    }
    return () => { io.disconnect(); anims.forEach(x => x.cancel()); arrival?.remove() }
    // bewusst nur einmal beim Laden der Seite
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps
}
