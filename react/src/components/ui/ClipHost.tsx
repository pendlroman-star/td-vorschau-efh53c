/* Träger für einen bewegten Hund. Das Video-DOM erzeugt und steuert lib/clips.ts
   (inkl. WebP-Ersatz, der <video>-Elemente austauscht) – React liefert nur den Platz dafür. */
import { useEffect, useRef, type RefObject } from 'react'
import { clipStart, clipStopp } from '../../lib/clips'

interface Props {
  /** baut das Clip-Element (z. B. schleifenClip(h) oder naturSzene(h)) */
  bauen: () => HTMLElement | null
  /** sofort starten (sonst startet der Aufrufer selbst über mediaRef, z. B. erst bei „Match gefunden!“) */
  autoStart?: boolean
  mediaRef?: RefObject<HTMLElement | null>
  className?: string
}

export function ClipHost({ bauen, autoStart = true, mediaRef, className }: Props) {
  const host = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const media = bauen()
    if (!media || !host.current) return
    host.current.appendChild(media)
    if (mediaRef) mediaRef.current = media
    if (autoStart) clipStart(media)
    return () => {
      if (mediaRef) mediaRef.current = null
      clipStopp(media)
    }
    // bewusst nur beim Einhängen: der Clip wird einmal gebaut und läuft dann selbstständig
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <div ref={host} className={className} />
}
