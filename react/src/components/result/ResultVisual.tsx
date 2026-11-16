/* Bild oben auf der Ergebnisseite – gleiche Anordnung von Formen wie im Slider (KOMPOSITION),
   bewegter Hund (oder Standbild bei „Bewegung reduzieren“), zwei Icons.
   Variante „Natur“ (?stil=natur): Naturszene in Bubble-Maske statt Formen. */
import type { CSSProperties } from 'react'
import { BUBBLES } from '../../data/formen'
import type { Hund } from '../../data/hunde'
import { ICONS, iconWidth, type IconName } from '../../data/icons'
import { KOMPOSITION } from '../../data/komposition'
import { naturSzene, schleifenClip } from '../../lib/clips'
import { ClipHost } from '../ui/ClipHost'
import './resultVisual.css'

// Nur zwei Icons, bei jedem Hund gleich (Romans Wunsch): Herz oben rechts, Pfote unten links – diagonal
// gegenüber. Sie sitzen außen am Rand der Bubbles und berühren ihn leicht.
const ERG_ICONS: { name: IconName; richtung: [number, number]; r: number }[] = [
  { name: 'herz', richtung: [1, -1], r: 8 },
  { name: 'pfote', richtung: [-1, 1], r: -10 },
]

// Natur-Variante: Umriss der Bubble-Form (je 5°, Werte 0…1); die Icons berühren ihn leicht
const UMRISS = [[.980,.505],[.980,.541],[.977,.587],[.971,.622],[.959,.667],[.942,.710],[.927,.741],[.903,.781],[.875,.819],[.852,.845],[.819,.878],[.782,.908],[.753,.928],[.713,.952],[.670,.973],[.626,.989],[.593,.998],[.547,1.007],[.501,1.012],[.455,1.013],[.409,1.010],[.365,1.002],[.322,.990],[.281,.975],[.241,.954],[.205,.930],[.164,.894],[.134,.861],[.108,.826],[.085,.787],[.065,.747],[.049,.704],[.040,.671],[.031,.627],[.025,.581],[.024,.547],[.027,.502],[.033,.456],[.040,.423],[.053,.379],[.065,.347],[.084,.306],[.107,.266],[.126,.238],[.154,.202],[.177,.178],[.210,.147],[.237,.126],[.275,.101],[.305,.085],[.345,.066],[.377,.054],[.419,.042],[.462,.033],[.505,.029],[.536,.028],[.578,.031],[.626,.039],[.666,.048],[.703,.060],[.740,.080],[.775,.110],[.802,.138],[.828,.166],[.859,.200],[.881,.228],[.908,.268],[.925,.300],[.944,.343],[.956,.377],[.969,.423],[.975,.458]]
const SZ = { l: -2, t: 3, s: 104 }            // Lage der Szene in cqw (wie im CSS)
const WINKEL = [315, 135]                     // Herz oben rechts, Pfote unten links (diagonal)

/** Lage eines Icons am Rand der Bubbles (Standard) bzw. am Rand der Naturszene */
function iconLage(idx: number, k: number, natur: boolean): [number, number] {
  const { name, richtung } = ERG_ICONS[k]
  const abst = iconWidth(name) * .42   // etwas weniger als halbe Icon-Breite → berührt den Rand
  if (natur) {
    const [px, py0] = UMRISS[Math.round(WINKEL[k] / 5) % 72]
    const py = .0152 + py0 * 160 / 165           // Maske ist im Seitenverhältnis 165:160 eingepasst
    const dx = px - .5, dy = py - .5, len = Math.hypot(dx, dy)
    return [SZ.l + px * SZ.s + dx / len * abst, SZ.t + py * SZ.s + dy / len * abst]
  }
  const [dx, dy] = richtung.map(v => v / Math.SQRT2)
  // äußerster Punkt aller (größeren) Bubbles in dieser Richtung; Bubble ≈ Kreis mit Radius .32 × Breite (wie iconPos)
  let best: { px: number; py: number; wert: number } | null = null
  KOMPOSITION[idx].bubbles.filter(b => b[2] >= 20).forEach(([bx, by, bw]) => {
    const R = .32 * bw, px = bx + dx * R, py = by + dy * R, wert = px * dx + py * dy
    if (!best || wert > best.wert) best = { px, py, wert }
  })
  const b = best!
  return [b.px + dx * abst, b.py + dy * abst]
}

interface Props {
  hund: Hund
  /** Index des Hundes in HUNDE (= Anordnung in KOMPOSITION) */
  idx: number
  ruhig: boolean
  natur: boolean
}

export function ResultVisual({ hund: h, idx, ruhig, natur }: Props) {
  const icons = (
    <div id="r-icons">
      {ERG_ICONS.map(({ name, r }, k) => {
        const [x, y] = iconLage(idx, k, natur)
        const i = ICONS[name]
        const style: CSSProperties = { '--x': x.toFixed(1), '--y': y.toFixed(1), '--r': r, '--w': iconWidth(name) }
        return (
          <div key={name} className="icon-slot" style={style}>
            <div className="icon-pop"><svg className="block w-full h-auto overflow-visible" viewBox={i.vb} aria-hidden="true"><path fill="currentColor" fillRule="evenodd" d={i.d} /></svg></div>
          </div>
        )
      })}
    </div>
  )

  if (natur) {
    return (
      <div className="r-visual" id="r-visual" aria-hidden="true" data-in>
        <ClipHost className="contents" bauen={() => naturSzene(h)} />
        {icons}
      </div>
    )
  }

  return (
    <div className="r-visual" id="r-visual" aria-hidden="true" data-in>
      <div id="r-bubbles">
        {BUBBLES.map((d, k) => {
          const [x, y, w, r] = KOMPOSITION[idx].bubbles[k]
          return <div key={k} className="bubble" style={{ '--x': x, '--y': y, '--s': w / 100, '--r': r }}><svg viewBox="0 0 200 200"><path d={d} /></svg></div>
        })}
      </div>
      {icons}
      <div className="r-shadow" />
      {/* Hund liegt vor den Icons */}
      {h.video && !ruhig
        ? <ClipHost className="r-clip" bauen={() => schleifenClip(h)} />
        : <img className="r-dog" id="r-dog" alt="" src={h.bild} />}
    </div>
  )
}
