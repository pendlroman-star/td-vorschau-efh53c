/* ==================================================================
   SLIDER-STEUERUNG (portiert aus dem Slider in index.html, Logik und Zeiten unverändert)
   ------------------------------------------------------------------
   Bewusst imperativ: Überblendungen, Formen-Gleiten, Rassenname und Videos sind
   auf Millisekunden abgestimmt (Web Animations API + Timer). HeroSlider.tsx
   rendert das Gerüst und übergibt die Elemente; diese Datei steuert sie.
   Klassen/Attribute der Folien (is-active, aria-hidden) setzt nur dieser Controller.
   ================================================================== */
import { CONFIG } from '../../data/config'
import { HUNDE, type Hund } from '../../data/hunde'
import { KOMPOSITION } from '../../data/komposition'
import { animErsatzAktiv, animZeigen, clipQuelle, spielen, stummesVideo, wachhund } from '../../lib/clips'
import { reduce } from '../../lib/env'
import { play, snapO, snapT } from '../../lib/motion'

export interface SliderElemente {
  showcase: HTMLElement
  stage: HTMLElement
  breed: HTMLElement
  bubbles: HTMLElement[]
  layers: HTMLElement[]
  /** eine <figure class="dog"> je Hund (gleiche Reihenfolge wie HUNDE) */
  slides: HTMLElement[]
}

export interface SliderSteuerung {
  /** „Bewegung anhalten“-Knopf (oder „Bewegung reduzieren“ im System) */
  setStill: (on: boolean) => void
  /** alles aufräumen (Timer, Beobachter, Ereignisse, Videos) */
  destroy: () => void
}

/** Inhalt einer Folie: bewegter Hund (Standbild + Video) oder – bei „Bewegung reduzieren“ – nur das Standbild */
function folienMedia(h: Hund): HTMLDivElement {
  const media = document.createElement('div')
  media.className = 'dog__media'
  const img = new Image()
  img.alt = `${h.name} – ${h.eigenschaften.slice(0, 3).join(', ')}`
  img.decoding = 'async'; img.draggable = false
  const k = h.video
  if (k && !reduce()) {
    // Bewegter Hund: nahtlose Schleife, beginnt an der typischsten Stelle (k.start) – der Hund steht nie still.
    const [l, t, w, hh] = k.box
    media.style.cssText = `--l:${l};--t:${t};--w:${w};--h:${hh}`
    img.src = k.poster; img.className = 'dog__clip'
    const v = stummesVideo()
    v.loop = true; v.preload = 'none'
    v.dataset.src = clipQuelle(k)   // wird erst kurz vor dem Auftritt geladen (siehe laden())
    v.dataset.start = String(k.start || 0)
    media.dataset.anim = k.anim     // Ersatz, falls das Video auf dem Gerät nicht startet
    // Sobald das Startbild bereitsteht, ersetzt das Video das Platzhalterbild
    const bereit = () => media.classList.add('is-playing')
    v.addEventListener('seeked', bereit); v.addEventListener('playing', bereit)
    media.append(img, v)
  } else {
    img.src = h.bild; img.width = 800; img.height = 880
    media.append(img)
  }
  return media
}

export function createHeroSlider(el: SliderElemente, { initialStill }: { initialStill: boolean }): SliderSteuerung {
  const { showcase, stage, breed, bubbles, layers, slides } = el
  const total = HUNDE.length
  const aufraeumen: (() => void)[] = []
  const timeouts = new Set<number>()
  const nachher = (ms: number, fn: () => void) => {
    const id = window.setTimeout(() => { timeouts.delete(id); fn() }, ms)
    timeouts.add(id)
  }

  // Jede Folie ist für Bildschirmleser beschrieben („1 von 6: Schäferhund"), nur die aktive ist sichtbar
  slides.forEach((fig, i) => {
    fig.setAttribute('aria-hidden', 'true')
    fig.replaceChildren(folienMedia(HUNDE[i]))
  })

  let seq = 0
  const later = (ms: number, fn: () => void) => { const s = seq; nachher(ms, () => { if (s === seq) fn() }) }

  // Clips erst laden, wenn der Hund dran oder als nächster an der Reihe ist (spart Datenvolumen)
  function laden(fig: HTMLElement | undefined) {
    const v = fig && fig.querySelector('video')
    if (!v || v.getAttribute('src')) return
    v.src = v.dataset.src || ''; v.preload = 'auto'
    v.addEventListener('loadedmetadata', () => { v.currentTime = +(v.dataset.start || 0) }, { once: true })
    v.load()
  }
  // Clip für den nächsten Auftritt wieder an seinen Startpunkt setzen
  function zurueck(fig: HTMLElement) {
    const v = fig.querySelector('video')
    if (!v) return
    v.pause()
    if (v.readyState >= 1) v.currentTime = +(v.dataset.start || 0)
  }
  // Clip des aktiven Hundes abspielen / anhalten (nur wenn Bewegung erlaubt ist)
  function clip(fig: HTMLElement, an: boolean) {
    const media = fig.firstElementChild as HTMLElement, v = fig.querySelector('video')
    if (!media.dataset.anim) return                         // Standbild (Bewegung reduzieren)
    if (animErsatzAktiv()) { if (an) animZeigen(media, media.dataset.anim); else media.classList.remove('is-playing'); return }
    if (!v) return
    if (an) { v.dataset.halt = ''; spielen(v); wachhund(v, () => animZeigen(media, media.dataset.anim)) }
    else { v.dataset.halt = '1'; v.pause() }
  }
  // Flüssiger Wechsel (Kundenwunsch): weiche Überblendung, der Hund bewegt sich dabei ohne Pause weiter –
  // auch während er aus- und der nächste schon eingeblendet wird.
  const T = { hund: 150 }
  function dogOut(fig: HTMLElement, dauer = 800) {
    const media = fig.firstElementChild as HTMLElement
    fig.classList.remove('is-active')
    fig.setAttribute('aria-hidden', 'true')
    play(fig, [{ opacity: snapO(fig) }, { opacity: 0 }], { duration: reduce() ? 400 : dauer, easing: 'cubic-bezier(.45, 0, .55, 1)' })
    nachher(dauer + 100, () => zurueck(fig))
    if (reduce()) return
    play(media, [{ transform: snapT(media) }, { transform: 'scale(.985)' }], { duration: dauer, easing: 'cubic-bezier(.45, 0, .55, 1)' })
  }
  function dogIn(fig: HTMLElement, delay = 0, dauer = 800) {
    const media = fig.firstElementChild as HTMLElement
    fig.classList.add('is-active')
    fig.removeAttribute('aria-hidden')
    if (!clipPause()) clip(fig, true)                       // läuft schon, bevor er sichtbar wird
    if (reduce()) { play(fig, [{ opacity: 0 }, { opacity: 1 }], { duration: 400 }); return }
    play(fig, [{ opacity: 0 }, { opacity: 1 }], { duration: dauer, delay, easing: 'cubic-bezier(.45, 0, .55, 1)' })
    play(media, [{ transform: 'scale(.985)' }, { transform: 'none' }], { duration: dauer + 100, delay, easing: 'cubic-bezier(.22, 1, .36, 1)' })
  }
  function setBubbles(i: number, pulse: boolean) {
    KOMPOSITION[i].bubbles.forEach(([x, y, w, r], k) => {
      const b = bubbles[k]
      b.style.setProperty('--x', String(x)); b.style.setProperty('--y', String(y))
      b.style.setProperty('--s', String(w / 100)); b.style.setProperty('--r', String(r))
      if (pulse && !reduce()) play(b.firstElementChild as HTMLElement, [
        { transform: 'scale(1)' }, { transform: 'scale(.9)', offset: .35 }, { transform: 'scale(1.04)', offset: .75 }, { transform: 'scale(1)' },
      ], { duration: 1100, delay: k * 60, easing: 'ease-in-out', fill: 'none' })
    })
  }
  // Rassenname: kurz ausblenden, wechseln, wenn der Hund „landet" wieder einblenden
  function breedSwap(i: number, first: boolean) {
    if (reduce() || first) {
      breed.textContent = HUNDE[i].name
      if (!reduce()) play(breed, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: 600, easing: 'cubic-bezier(.22, 1, .36, 1)' })
      return
    }
    play(breed, [{ opacity: snapO(breed), transform: 'none' }, { opacity: 0, transform: 'translateY(-4px)' }], { duration: 200, easing: 'ease-in' })
    later(T.hund + 150, () => {
      breed.textContent = HUNDE[i].name
      play(breed, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.22, 1, .36, 1)' })
    })
  }

  let current = -1
  function goTo(i: number) {
    i = (i + total) % total
    if (i === current) return
    const prev = current, first = prev === -1
    seq++
    laden(slides[i]); laden(slides[(i + 1) % total])
    if (first || reduce()) {
      if (!first) dogOut(slides[prev])
      setBubbles(i, false); dogIn(slides[i], 0)
    } else {
      dogOut(slides[prev])
      setBubbles(i, false)                                  // Kreise gleiten langsam an den neuen Platz (CSS)
      dogIn(slides[i], T.hund)                              // Überblendung: beide Hunde bewegen sich dabei weiter
    }
    breedSwap(i, first)
    current = i
    restartTimer()
  }
  function next() {
    const i = (current + 1) % total, v = slides[i].querySelector('video')
    if (!v || reduce() || v.readyState >= 3) return goTo(i)
    let los = false
    const go = () => { if (!los) { los = true; goTo(i) } }
    v.addEventListener('canplay', go, { once: true })
    nachher(1500, go)
  }

  // Automatischer Wechsel. Hält an, wenn die Maus darauf ruht, der Slider
  // nicht zu sehen ist oder der Tab im Hintergrund liegt (Restzeit bleibt erhalten).
  // „user" = Knopf „Bewegung anhalten". Bei „Bewegung reduzieren" im System startet alles angehalten.
  const pausedBy = { hover: false, hidden: false, offscreen: false, user: false }
  let timer: number | null = null, remaining = CONFIG.intervall, startedAt = 0   // (Verweildauer siehe verweil())
  const isPaused = () => Object.values(pausedBy).some(Boolean)
  // Clip läuft auch bei Maus über dem Slider weiter – nur der Wechsel wartet
  const clipPause = () => pausedBy.user || pausedBy.hidden || pausedBy.offscreen
  function run() { if (timer !== null) clearTimeout(timer); startedAt = performance.now(); timer = window.setTimeout(() => { timer = null; next() }, remaining) }
  function halt() { if (timer === null) return; clearTimeout(timer); timer = null; remaining = Math.max(0, remaining - (performance.now() - startedAt)) }
  // Hunde mit Clip bleiben so lange, bis ihre Bewegung einmal ganz abgelaufen ist
  const verweil = () => (HUNDE[current] && HUNDE[current].video && !reduce()) ? CONFIG.dauerHund : CONFIG.intervall
  function restartTimer() { if (timer !== null) clearTimeout(timer); timer = null; remaining = verweil(); sync() }
  function sync() {
    if (isPaused()) halt(); else if (timer === null) run()
    if (slides[current]) clip(slides[current], !clipPause())
  }
  const setPause = (k: keyof typeof pausedBy, v: boolean) => { pausedBy[k] = v; sync() }

  const on = <K extends keyof HTMLElementEventMap>(t: HTMLElement, typ: K, fn: (e: HTMLElementEventMap[K]) => void) => {
    t.addEventListener(typ, fn); aufraeumen.push(() => t.removeEventListener(typ, fn))
  }
  on(showcase, 'pointerenter', e => { if (e.pointerType === 'mouse') setPause('hover', true) })
  on(showcase, 'pointerleave', e => { if (e.pointerType === 'mouse') setPause('hover', false) })
  const onVisibility = () => setPause('hidden', document.hidden)
  document.addEventListener('visibilitychange', onVisibility)
  aufraeumen.push(() => document.removeEventListener('visibilitychange', onVisibility))
  const io = new IntersectionObserver(([e]) => setPause('offscreen', !e.isIntersecting), { threshold: .25 })
  io.observe(stage)
  aufraeumen.push(() => io.disconnect())

  function setStill(an: boolean) {
    if (an === pausedBy.user) return
    pausedBy.user = an
    if (!an) remaining = verweil()
    sync()
  }

  // Leichter 3D-Effekt mit der Maus
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0
  function tick() {
    cx += (tx - cx) * .08; cy += (ty - cy) * .08
    layers.forEach(l => { const d = parseFloat(l.dataset.depth || '') || 0; l.style.transform = `translate3d(${(cx * d * 8).toFixed(2)}px, ${(cy * d * 6).toFixed(2)}px, 0)` })
    raf = (Math.abs(tx - cx) > .002 || Math.abs(ty - cy) > .002) ? requestAnimationFrame(tick) : 0
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick) }
  on(showcase, 'pointermove', e => {
    if (!CONFIG.parallax || !fine.matches || reduce() || e.pointerType !== 'mouse') return
    const r = stage.getBoundingClientRect()
    tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
    ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1))
    kick()
  })
  on(showcase, 'pointerleave', () => { tx = 0; ty = 0; kick() })

  pausedBy.user = initialStill
  goTo(0)

  return {
    setStill,
    destroy() {
      seq++
      aufraeumen.forEach(f => f())
      timeouts.forEach(id => clearTimeout(id))
      if (timer !== null) clearTimeout(timer)
      if (raf) cancelAnimationFrame(raf)
      slides.forEach(fig => {
        fig.querySelectorAll('video').forEach(v => { v.dataset.halt = '1'; v.pause() })
        fig.getAnimations({ subtree: true }).forEach(a => a.cancel())
        fig.replaceChildren()
        fig.classList.remove('is-active')
      })
      breed.getAnimations().forEach(a => a.cancel())
      breed.textContent = ''
    },
  }
}

