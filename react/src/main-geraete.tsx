/* GERÄTEANSICHT – NUR FÜR ENTWICKLER/TEST. VOR DEM LIVEGANG ENTFERNEN
   (zusammen mit geraete.html, components/dev/ und dem Eintrag in vite.config.ts). */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { GeraeteApp } from './components/dev/GeraeteApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GeraeteApp />
  </StrictMode>,
)
