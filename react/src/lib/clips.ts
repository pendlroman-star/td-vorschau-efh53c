/* ==================================================================
   BEWEGTE HUNDE – Video-Steuerung (portiert aus daten.js, Logik unverändert)
   ------------------------------------------------------------------
   Bewusst framework-unabhängig (reines DOM): Die Videos werden hier erzeugt,
   gestartet, überblendet und notfalls durch animiertes WebP ersetzt (dabei
   werden <video>-Elemente entfernt). React stellt nur ein Träger-Element bereit
   (siehe components/ui/ClipHost.tsx bzw. den Slider-Controller).

   · Engine: Safari/iPhone (WebKit) kann durchsichtige Videos nur als HEVC (.mov),
     alle anderen nur als WebM (VP9 mit Alpha). Chrome am Mac spielt HEVC zwar ab,
     aber ohne Transparenz – daher nach Browser-Engine wählen ('GestureEvent' in window).
   · Wachhund: Hat ein Video nach 1,6 s nicht über 0,05 s hinaus gespielt, schaltet
     die Seite für ALLE Hunde auf animiertes WebP um (*-anim.webp / *-schleife-anim.webp).
   · ?ersatz=1 in der Adresse erzwingt den WebP-Ersatz (zum Testen).
   · spielen(): blockiert der Browser das automatische Abspielen (Stromsparmodus),
     starten die Videos bei der ersten Berührung, dem ersten Klick oder Tastendruck.
   ================================================================== */
import type { Hund, HundeClip } from '../data/hunde'
import { CLIP_VERSION } from '../data/hunde'

/** WebKit (Safari/iPhone)? → HEVC mit Alphakanal, sonst WebM */
export const istWebkit = (): boolean => 'GestureEvent' in window
export const clipQuelle = (v: Pick<HundeClip, 'hevc' | 'webm'>): string => (istWebkit() ? v.hevc : v.webm)

// Ersatz für Geräte, auf denen die Videos nicht starten (manche Safari-Versionen, Macs/iPhones ohne passenden
// Video-Baustein, Stromsparmodus): animiertes WebP (12 Bilder/s, läuft in jedem Browser, ist aber schwerer).
// Startet ein Video nicht binnen 1,6 s, schaltet die Seite für alle Hunde auf den Ersatz um.
let ANIM_ERSATZ = /[?&]ersatz=1/.test(location.search)   // ?ersatz=1 erzwingt den Ersatz (zum Testen)
/** Ist der WebP-Ersatz aktiv (erzwungen oder vom Wachhund eingeschaltet)? */
export const animErsatzAktiv = (): boolean => ANIM_ERSATZ

const animDaten: Record<string, Promise<Blob>> = {}   // einmal geladen, je Auftritt neu gestartet (Blob-Adresse)

/** Videos im Träger entfernen und stattdessen das animierte WebP zeigen */
export function animZeigen(media: HTMLElement | null, src: string | undefined): void {
  if (!media || !src) return
  media.querySelectorAll('video').forEach(v => { v.pause(); v.remove() })
  let a = media.querySelector<HTMLImageElement>('img.dog__anim')
  if (!a) { a = new Image(); a.className = 'dog__clip dog__anim'; a.alt = ''; a.decoding = 'async'; media.appendChild(a) }
  const img = a;
  (animDaten[src] || (animDaten[src] = fetch(src).then(r => r.blob()))).then(blob => {
    const alt = img.dataset.url, url = URL.createObjectURL(blob)   // neue Adresse = Animation beginnt von vorne
    img.onload = () => { media.classList.add('is-playing'); if (alt) URL.revokeObjectURL(alt) }
    img.dataset.url = url; img.src = url
  }).catch(() => {})
}

/** Prüft nach 1,6 s, ob das Video wirklich läuft – sonst Ersatz für alle Hunde */
export function wachhund(v: HTMLVideoElement, ersatz: () => void): void {
  setTimeout(() => {
    if (ANIM_ERSATZ || !v.isConnected || v.dataset.halt === '1') return
    if (v.currentTime < .05) { ANIM_ERSATZ = true; ersatz() }
  }, 1600)
}

// Blockiert der Browser das automatische Abspielen (z. B. Stromsparmodus am iPhone/MacBook),
// starten die Videos bei der ersten Berührung, dem ersten Klick oder Tastendruck auf der Seite.
export function spielen(v: HTMLVideoElement): void {
  const p = v.play()
  if (p && p.catch) p.catch(() => {
    const los = () => { v.play().catch(() => {}); (['pointerdown', 'touchend', 'keydown'] as const).forEach(e => removeEventListener(e, los)) };
    (['pointerdown', 'touchend', 'keydown'] as const).forEach(e => addEventListener(e, los, { once: true, passive: true }))
  })
}

/** <video> wie im Original: stumm, inline, ohne Bild-im-Bild, für Bildschirmleser verborgen */
export function stummesVideo(cls = 'dog__clip'): HTMLVideoElement {
  const v = document.createElement('video')
  if (cls) v.className = cls
  v.muted = true; v.playsInline = true
  v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true')
  v.disablePictureInPicture = true
  return v
}

/* Bewegter Hund als Baustein (Analyse, Ergebnisseite) – entspricht clipHTML() im Original.
   Derselbe Clip wie im Slider der Startseite (Romans Wunsch 12.11.2026) – dort wechselt nach 3 s der Hund,
   hier läuft ein Hund durch. Für den Rücksprung liegen zwei Videos desselben Clips übereinander (siehe clipStart). */
export function schleifenClip(h: Hund, cls = ''): HTMLDivElement | null {
  const c = h.video
  if (!c) return null
  const [l, t, w, hh] = c.box
  const media = document.createElement('div')
  media.className = `dog__media dog__media--schleife ${cls}`.trim()
  media.style.cssText = `--l:${l};--t:${t};--w:${w};--h:${hh}`
  if (c.schleife) { media.dataset.von = String(c.schleife[0]); media.dataset.bis = String(c.schleife[1]) }
  media.dataset.anim = c.animSchleife
  const img = document.createElement('img')
  img.className = 'dog__clip'; img.src = c.poster; img.alt = ''
  media.appendChild(img)
  for (let n = 0; n < (c.schleife ? 2 : 1); n++) {
    const v = stummesVideo()
    v.preload = 'auto'
    v.src = clipQuelle(c)
    media.appendChild(v)
  }
  return media
}

/* Variante „Natur“ (ergebnis.html?…&stil=natur): Hund in einer Naturszene, in einer Bubble-Form maskiert. */
export function naturSzene(h: Hund): HTMLDivElement {
  const szene = document.createElement('div')
  szene.className = 'r-szene'
  const q = `bilder/hunde/natur/${h.id}`, ver = `?v=${CLIP_VERSION}`
  const bild = document.createElement('div')
  bild.className = 'r-szene__bild'
  const img = document.createElement('img')
  img.src = `${q}-poster.webp${ver}`; img.alt = ''
  const v = stummesVideo('')
  v.loop = true; v.preload = 'auto'; v.src = `${q}.mp4${ver}`
  bild.append(img, v)
  szene.appendChild(bild)
  return szene
}

// Rücksprung der Schleife: Der zweite Durchlauf startet CLIP_VORLAUF Sekunden vor „von", während der erste noch
// CLIP_VORLAUF Sekunden vor „bis" steht – beide zeigen also dieselbe Bewegung. Erst blendet der neue über dem alten
// ein, dann der alte darunter aus (je CLIP_BLENDE ms). Der Hund wird dabei nie durchsichtig.
const CLIP_BLENDE = 60, CLIP_VORLAUF = .125

/** Einzelnen Hund in Dauerschleife abspielen (Auswertung, Ergebnisseite) */
export function clipStart(media: HTMLElement | null): void {
  const vs = media ? [...media.querySelectorAll('video')] : []
  if (!media || !vs.length) return
  if (ANIM_ERSATZ) return animZeigen(media, media.dataset.anim)
  wachhund(vs[0], () => animZeigen(media, media.dataset.anim))
  const von = +(media.dataset.von ?? 0) || 0, bis = +(media.dataset.bis ?? 0) || 0
  const bereit = Math.max(0, von - CLIP_VORLAUF)        // hier wartet der jeweils ruhende Durchlauf
  vs.forEach(v => { v.muted = true })
  let aktiv = 0, blendet = false, einfach = vs.length < 2 || !bis
  vs[0].classList.add('is-da')
  vs[0].addEventListener('playing', () => media.classList.add('is-playing'), { once: true })
  if (einfach) vs[0].loop = true
  spielen(vs[0])
  if (einfach) return
  vs[1].addEventListener('loadedmetadata', () => { vs[1].currentTime = bereit }, { once: true })
  // Verweigert der Browser den zweiten Durchlauf (z. B. Stromsparmodus), läuft der erste als einfache Schleife weiter
  const schlicht = (v: HTMLVideoElement) => { einfach = true; blendet = false; v.loop = true; if (v.ended || v.paused) spielen(v) }
  function wechsel() {
    const alt = vs[aktiv], neu = vs[1 - aktiv]
    blendet = true
    if (Math.abs(neu.currentTime - bereit) > .08) neu.currentTime = bereit   // falls er noch nicht bereitsteht
    // (ältere Browser liefern bei play() kein Promise – dann sofort weiter)
    Promise.resolve(neu.play()).then(() => {
      media!.classList.add('is-ueberblendet')
      neu.style.zIndex = '2'; alt.style.zIndex = '1'
      neu.classList.add('is-da')
      setTimeout(() => alt.classList.remove('is-da'), CLIP_BLENDE)
      setTimeout(() => { alt.pause(); alt.currentTime = bereit; aktiv = 1 - aktiv; blendet = false }, CLIP_BLENDE * 2 + 60)
    }).catch(() => schlicht(alt))
  }
  (function takt() {
    if (einfach || !media.isConnected || !vs[aktiv].isConnected) return   // (Ersatzbild übernommen → Ende)
    const v = vs[aktiv]
    if (!blendet && v.duration && (v.ended || Math.min(bis, v.duration) - v.currentTime <= CLIP_VORLAUF)) wechsel()
    requestAnimationFrame(takt)
  })()
}

/** Aufräumen, wenn React einen Träger entfernt: Videos anhalten, Element aus dem DOM nehmen */
export function clipStopp(media: HTMLElement | null): void {
  if (!media) return
  media.querySelectorAll('video').forEach(v => v.pause())
  media.remove()
}
