/* ------------------------------------------------------------------
   KOMPOSITION (Slider auf der Startseite + Bild oben auf der Ergebnisseite) (Werte in % der Bühnenbreite; Bühne 100 × 110)
   bubbles: [x, y, Größe, Drehung]
   icons:   [Nr. der Bubble (0–4), Winkel in Grad (0 = rechts, 90 = unten), Drehung]
            → jedes Icon sitzt genau auf dem Rand dieser Bubble und berührt sie immer
   ------------------------------------------------------------------ */
type Bubble = [x: number, y: number, groesse: number, drehung: number]
type IconPlatz = [bubble: number, winkel: number, drehung: number]

export const KOMPOSITION: { bubbles: Bubble[]; icons: IconPlatz[] }[] = [
  { bubbles: [[48, 58, 112, 0], [64, 34, 66, 18], [28, 80, 50, -12], [84, 82, 46, 40], [90, 26, 9, 0]],   icons: [[0, 215, -6], [3, 330, 8], [2, 160, -8]] },
  { bubbles: [[54, 60, 108, 24], [34, 30, 62, -10], [78, 78, 52, 20], [18, 86, 42, 60], [12, 40, 8, 0]],  icons: [[1, 200, -8], [2, 0, 0], [3, 200, -4]] },
  { bubbles: [[50, 64, 114, -14], [70, 36, 60, 30], [26, 74, 56, 8], [86, 88, 40, -20], [44, 14, 7, 0]],  icons: [[1, 0, 6], [3, 330, -6], [2, 200, 0]] },
  { bubbles: [[50, 60, 110, 36], [30, 38, 64, 12], [76, 74, 54, -16], [22, 90, 42, 30], [92, 50, 8, 0]],  icons: [[2, 340, 8], [0, 165, -10], [1, 225, 0]] },
  { bubbles: [[52, 58, 112, -24], [72, 42, 64, -8], [30, 80, 52, 22], [80, 90, 44, 10], [8, 24, 9, 0]],   icons: [[0, 225, -8], [1, 10, 8], [3, 340, 0]] },
  { bubbles: [[48, 62, 108, 12], [36, 34, 62, 24], [74, 80, 54, -6], [20, 82, 46, -30], [88, 18, 8, 0]],  icons: [[0, 172, -6], [2, 330, 6], [1, 215, -4]] },
]

// Position eines Icons: sitzt immer auf dem Rand der gewählten Bubble
// (derzeit nicht verwendet – die Ergebnisseite berechnet ihre zwei Icons selbst, siehe ResultVisual)
export function iconPos(i: number, k: number): [number, number, number] {
  const [bi, ang, r] = KOMPOSITION[i].icons[k]
  const [bx, by, bw] = KOMPOSITION[i].bubbles[bi]
  const a = ang * Math.PI / 180, RAND = .32
  return [bx + RAND * bw * Math.cos(a), by + RAND * bw * Math.sin(a), r]
}
