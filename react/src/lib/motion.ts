/* Kleine Hilfen für Web-Animationen (WAAPI) – portiert aus index.html */

const anims = new WeakMap<Element, Animation>()

/** Animation starten; eine noch laufende Animation desselben Elements wird abgelöst (fill: 'both' als Standard). */
export function play(el: Element, keyframes: Keyframe[], opts: KeyframeAnimationOptions): Animation {
  const prev = anims.get(el)
  const a = el.animate(keyframes, { fill: 'both', ...opts })
  if (prev) prev.cancel()
  anims.set(el, a)
  return a
}

/** aktueller transform-Wert (für weiche Übergänge aus einer laufenden Animation heraus) */
export const snapT = (el: Element): string => {
  const t = getComputedStyle(el).transform
  return t === 'none' ? 'none' : t
}
/** aktuelle Deckkraft */
export const snapO = (el: Element): string => getComputedStyle(el).opacity
