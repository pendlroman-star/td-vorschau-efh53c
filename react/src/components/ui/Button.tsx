/* Knopf/Link im Stil der Seite (im Original: .btn, .btn--small, .btn--big, .btn--outline, .btn--red, .btn--ghost) */
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { ArrowIcon } from './icons'

type Variante = 'lime' | 'outline' | 'red' | 'ghost'
type Groesse = 'sm' | 'md' | 'lg'

interface Gemeinsam {
  variante?: Variante
  groesse?: Groesse
  /** Pfeil-Symbol rechts (wie „Jetzt starten“) */
  pfeil?: boolean
  className?: string
  children: ReactNode
}

const BASIS = [
  'group inline-flex items-center justify-center gap-[.6em] border-2 border-solid',
  'font-body font-bold leading-[1.2] no-underline cursor-pointer transition-btn',
  'hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-12px_rgba(13,58,32,.55)]',
  'active:translate-y-0 active:scale-[.98] motion-reduce:transition-none',
].join(' ')

const VARIANTE: Record<Variante, string> = {
  lime: 'bg-lime text-forest border-transparent hover:bg-[#b0d45f]',
  outline: 'bg-transparent text-forest border-forest hover:bg-lime-100',
  red: 'bg-red text-white border-transparent hover:bg-red-700',
  // im dunklen Header
  ghost: 'bg-transparent text-white border-white/28 hover:bg-white/8 hover:border-white/55 hover:shadow-none',
}

const GROESSE: Record<Groesse, string> = {
  sm: 'min-h-10 py-[.5em] px-[1.1em] text-[.92rem] rounded-[10px]',
  md: 'min-h-12 py-[.7em] px-[1.4em] text-base rounded-xl',
  lg: 'min-h-[58px] py-[.8em] text-[1.08rem] rounded-[14px]',
}

function buttonKlassen({ variante = 'lime', groesse = 'md', pfeil = false, className = '' }: Omit<Gemeinsam, 'children'>): string {
  // großer Knopf mit Pfeil: rechts weniger Innenabstand, weil das Symbol eine eigene Fläche hat
  const lgPadding = groesse === 'lg' ? (pfeil ? 'pl-[1.8em] pr-[1.4em]' : 'px-[1.8em]') : ''
  return `${BASIS} ${VARIANTE[variante]} ${GROESSE[groesse]} ${lgPadding} ${className}`.trim()
}

/** grünes Kästchen mit Pfeil (im Original: .btn__icon) */
function Pfeil() {
  return (
    <span aria-hidden="true" className="grid place-items-center size-[34px] rounded-[10px] bg-forest text-lime transition-transform duration-400 ease-spring group-hover:translate-x-[3px] group-hover:-rotate-6">
      <ArrowIcon className="size-[18px]" />
    </span>
  )
}

export function ButtonLink({ variante, groesse, pfeil, className, children, ...rest }: Gemeinsam & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={buttonKlassen({ variante, groesse, pfeil, className })} {...rest}>
      {children}{pfeil && <Pfeil />}
    </a>
  )
}

export function Button({ variante, groesse, pfeil, className, children, type = 'button', ...rest }: Gemeinsam & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonKlassen({ variante, groesse, pfeil, className })} {...rest}>
      {children}{pfeil && <Pfeil />}
    </button>
  )
}
