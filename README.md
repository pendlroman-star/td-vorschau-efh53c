# Tierischer Doppelgänger – Prototyp

Quiz-Landingpage für Arche Noah – Aktiver Tierschutz Austria. Reine HTML/CSS/JavaScript-Seiten, kein Framework, kein Build-Schritt.

| Datei | Inhalt |
|---|---|
| `index.html` | Übersicht mit Links zu allen Testversionen |
| `landingpage.html` | Version 1 – Hero mit Hunde-Slider |
| `landingpage-v2.html` | Version 2 – Hero mit Gruppenbild-Animation |
| `ergebnis.html?hund=…` | Ergebnisseite (`schaeferhund`, `jack`, `dackel`, `havaneser`, `collie`, `labrador`) |
| `daten.js` | Hunde, Eigenschaften, Icons, Ergebnistexte, Anordnung der Formen |

Wichtige Stellen zum Anpassen:
- Texte und Platzhalter der Ergebnisseite: `daten.js` → `HUNDE[…].ergebnis`
- Quizfragen und Punkte: `QUIZ` in `landingpage.html` / `landingpage-v2.html`
- E-Mail-Formular (iframe): `CONFIG.formularUrl` in den Landingpages
- Spendenformular: wird unter `*.aktivertierschutz.at` automatisch als echtes iframe eingebunden, sonst als Nachbildung gezeigt
- Choreografie Gruppenbild: `GRUPPE` in `landingpage-v2.html`

Die Seite ist für Suchmaschinen gesperrt (`robots.txt`, `noindex`).
