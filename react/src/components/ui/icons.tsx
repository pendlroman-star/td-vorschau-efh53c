/* Kleine SVG-Symbole aus dem Original (alle dekorativ → aria-hidden) */
import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

/** Pfote (gefüllt) */
export const PawIcon = (p: P) => (
  <svg viewBox="0 0 32 32" aria-hidden="true" {...p}><g fill="currentColor"><ellipse cx="16" cy="21.5" rx="7" ry="6" /><ellipse cx="7" cy="13.5" rx="2.8" ry="3.4" transform="rotate(-18 7 13.5)" /><ellipse cx="12.5" cy="8" rx="2.8" ry="3.6" transform="rotate(-6 12.5 8)" /><ellipse cx="19.5" cy="8" rx="2.8" ry="3.6" transform="rotate(6 19.5 8)" /><ellipse cx="25" cy="13.5" rx="2.8" ry="3.4" transform="rotate(18 25 13.5)" /></g></svg>
)

export const HEART_PATH = 'M24.3 40.5c-6.8-4.6-15.6-11.2-17.6-18.4-1.6-5.6 1.6-11.4 7-12.1 4.3-.6 8.4 2.4 10.4 6.6 1.9-4.6 6-7.6 10.6-6.9 5.6.9 8.3 7 6.3 12.6-2.4 6.9-10.5 13.3-16.9 18.1z'

/** Herz (gefüllt) */
export const HeartIcon = (p: P) => (
  <svg viewBox="0 0 48 48" aria-hidden="true" {...p}><path fill="currentColor" d={HEART_PATH} /></svg>
)

/** Pfeil nach rechts (Start-/Absende-Knopf) */
export const ArrowIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12.5h13M13 6.5l6 6-6 6" /></svg>
)

/** Häkchen */
export const CheckIcon = ({ strokeWidth = '3.2', ...p }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
)

/** Pfeil nach unten (FAQ) */
export const ChevronIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}><path d="M6 9l6 6 6-6" /></svg>
)
