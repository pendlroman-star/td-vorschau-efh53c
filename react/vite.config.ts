import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// Mehrseitiger Build ohne Router: jede HTML-Datei ist ein eigener Einstieg,
// damit Adressen (ergebnis.html?hund=…&echo=…) und sessionStorage-Schlüssel wie im Original bleiben.
// Das Hauptskript blockiert das erste Zeichnen, bis React die Seite aufgebaut hat. Sonst zeigt der Browser
// zuerst eine leere Seite und der weiche Seitenwechsel (View Transition „match-hund“: der Hund gleitet aus
// der Analyse in die Ergebnisseite) bricht ab. Vite entfernt das Attribut im Quell-HTML, daher hier nachträglich.
const renderBlockieren = (): Plugin => ({
  name: 'render-blockieren',
  transformIndexHtml: {
    order: 'post',
    handler: html => html.replace(/<script type="module"(?![^>]*blocking=)/g, '<script type="module" blocking="render"'),
  },
})

export default defineConfig({
  // relative Pfade: der Build funktioniert auch in einem Unterordner
  base: './',
  plugins: [react(), tailwindcss(), renderBlockieren()],
  build: {
    outDir: '../react-vorschau',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        ergebnis: resolve(import.meta.dirname, 'ergebnis.html'),
        // NUR TESTSEITE – vor dem Livegang entfernen (siehe README)
        geraete: resolve(import.meta.dirname, 'geraete.html'),
      },
    },
  },
})
