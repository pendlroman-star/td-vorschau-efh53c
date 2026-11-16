/* Inhaltsbreite der Seite (im Original: .wrap – max. 1200 px, seitlicher Rand 16–40 px) */
import type { ComponentProps } from 'react'

export function Wrap({ className = '', schmal = false, ...rest }: ComponentProps<'div'> & { schmal?: boolean }) {
  return <div className={`wrap ${schmal ? 'max-w-[880px]' : 'max-w-[1200px]'} ${className}`} {...rest} />
}
