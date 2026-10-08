# Tierischer Doppelgänger – Prototyp

Quiz-Landingpage für Arche Noah – Aktiver Tierschutz Austria. Reine HTML/CSS/JavaScript-Seiten, kein Framework, kein Build-Schritt.

| Datei | Inhalt |
|---|---|
| `index.html` | Landingpage – Hero mit Hunde-Slider, Quiz, FAQ |
| `landingpage.html` | Weiterleitung auf `index.html` (alte Adresse) |
| `ergebnis.html?hund=…` | Ergebnisseite (`schaeferhund`, `jack`, `dackel`, `havaneser`, `collie`, `labrador`) |
| `daten.js` | Hunde, Eigenschaften, Icons, Ergebnistexte, Anordnung der Formen |

Wichtige Stellen zum Anpassen:
- Texte und Platzhalter der Ergebnisseite: `daten.js` → `HUNDE[…].ergebnis`
- Quizfragen und Punkte: `QUIZ` in `index.html`
- E-Mail-Formular (iframe): `CONFIG.formularUrl` in `index.html`
- Spendenformular: wird unter `*.aktivertierschutz.at` automatisch als echtes iframe eingebunden, sonst als Nachbildung gezeigt

Die Seite ist für Suchmaschinen gesperrt (`robots.txt`, `noindex`).
