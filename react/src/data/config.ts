/* ------------------------------------------------------------------
   EINSTELLUNGEN (im Original: CONFIG in index.html, Spendenformular in ergebnis.html)
   ------------------------------------------------------------------ */
export interface Config {
  /** ms bis zum nächsten Hund (Standbilder) */
  intervall: number
  /** leichter 3D-Effekt mit der Maus im Slider */
  parallax: boolean
  /** ms je bewegtem Hund */
  dauerHund: number
  /** Adresse des echten E-Mail-Formulars (iframe). Leer = Platzhalter-Formular */
  formularUrl: string
  ergebnisSeite: string
  /** ms für den Übergang „Dein Doppelgänger wird analysiert …“ */
  analyseDauer: number
  /** Produkt-ID des Spendenwidgets bei formulare.aktivertierschutz.at (nur auf der Live-Seite eingebunden).
      Offen: Gibt es beim Formularanbieter ein eigenes Produkt für die Dauerspende (monatlich voreingestellt)? Dann hier eintragen. */
  spendenProduktId: number
}

export const CONFIG: Config = {
  intervall: 3500, parallax: true,     // ms bis zum nächsten Hund (Standbilder)
  dauerHund: 3000,                     // ms je bewegtem Hund – kürzer als das durchgehende Clip-Stück (~4,2 s inkl. Überblendung),
                                       // so ist im Slider nie ein Schleifenschnitt zu sehen
  formularUrl: '',               // ← Adresse des echten Formulars (iframe). Leer = Platzhalter-Formular
  ergebnisSeite: 'ergebnis.html',
  analyseDauer: 6000,            // ms für „Dein Doppelgänger wird analysiert …" (Kunde: etwas langsamer)
  spendenProduktId: 115,         // Spendenwidget laut Kunde (16.11.2026)
}

/** Adresse des echten Spendenformulars (iframe auf *.aktivertierschutz.at) */
export const spendenFormularUrl = (): string =>
  `https://formulare.aktivertierschutz.at/embed/product?productid=${CONFIG.spendenProduktId}`
/** Skripte des Formularanbieters (Höhe des iframes, Registrierung, API) – in dieser Reihenfolge laden */
export const SPENDEN_SKRIPTE = ['iFrameResizer.min.js', 'IFrameRegistration.js', 'fso-forms-api-parent.js'].map(
  f => `https://formulare.aktivertierschutz.at/js/${f}`,
)
