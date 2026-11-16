import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import './index.css'
import './styles/clips.css'
import './styles/marker.css'
import { Landing } from './pages/Landing'

// Kennzeichen „JavaScript aktiv“ – erst dann starten die Einblende-Animationen unsichtbar
document.documentElement.classList.add('js')

// Sofort (synchron) zeichnen: so steht die Seite schon beim ersten Bild – nötig für den weichen
// Seitenwechsel (View Transition „match-hund“), der den Hund aus der Analyse in die Ergebnisseite gleiten lässt.
const root = createRoot(document.getElementById('root')!)
flushSync(() => root.render(
  <StrictMode>
    <Landing />
  </StrictMode>,
))
