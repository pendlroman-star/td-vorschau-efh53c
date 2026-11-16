import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import './index.css'
import './styles/clips.css'
import './styles/marker.css'
import { reduce } from './lib/env'
import { ANKUNFT_KEY } from './lib/text'
import { Result } from './pages/Result'

// Kennzeichen „JavaScript aktiv“ – erst dann starten die Auftritts-Elemente unsichtbar
document.documentElement.classList.add('js')

// Kommt der Besuch direkt vom Quiz? (Merker gilt nur einmal)
let ankunft = false
try { ankunft = sessionStorage.getItem(ANKUNFT_KEY) === '1'; sessionStorage.removeItem(ANKUNFT_KEY) } catch { /* privates Fenster */ }

// Sofort (synchron) zeichnen: so steht die Seite schon beim ersten Bild – nötig für den weichen
// Seitenwechsel (View Transition „match-hund“), der den Hund aus der Analyse in die Ergebnisseite gleiten lässt.
const root = createRoot(document.getElementById('root')!)
flushSync(() => root.render(
  <StrictMode>
    <Result ankunft={ankunft} ruhig={reduce()} />
  </StrictMode>,
))
