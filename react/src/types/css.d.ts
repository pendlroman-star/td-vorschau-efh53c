import 'react'

// Eigene CSS-Variablen im style-Attribut erlauben, z. B. style={{ '--d': '80ms' }}
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined
  }
}
