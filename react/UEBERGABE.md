# Übergabe: „Tierischer Doppelgänger“ – Quiz-Landingpage für Arche Noah / Aktiver Tierschutz Austria

Stand: 16.11.2026 · Konzept & Design: Roman Pendl (Form und Zeichen)

Diese Übergabe richtet sich an die Entwicklung. Sie ergänzt die technische Anleitung `README.md` im selben Ordner
(Befehle, Ordnerstruktur, Tailwind-Details). Hier steht das Gesamtbild: was die Seite tut, was fertig ist,
was bewusst so entschieden wurde und was vor dem Livegang noch zu tun ist.

---

## 1. Worum es geht

Eine Quiz-Landingpage: Besucher beantworten **5 Fragen** und erfahren, welcher von **6 Hunde-Charakteren** zu ihnen
passt (Schäferhund, Jack Russell Terrier, Dackel, Havaneser, Border Collie, Labrador Retriever). Auf der
Ergebnisseite stellt sich ein **echter Hund aus dem Tierheim** mit demselben Charakter vor und bittet um eine
Spende. Ziel: neue Kontakte (E-Mail-Adressen) und Spenden für Aktiver Tierschutz Austria.

## 2. Was übergeben wird

| Teil | Wo | Zweck |
|---|---|---|
| **React-Projekt** | `react/` (dieser Ordner) | Das zu übernehmende Projekt: React 19 + Vite + TypeScript + Tailwind CSS 4 |
| **Prototyp (Referenz)** | `index.html`, `ergebnis.html`, `daten.js` im Ordner darüber | Statischer Stand, an dem alle Kundenabstimmungen stattfanden. Die React-Fassung sieht genauso aus und verhält sich genauso. |
| **Testseite** | https://hunde-doppel.netlify.app | Zeigt den Prototyp – gilt als Referenz für Aussehen und Verhalten |
| **Bilder & Videos** | `bilder/` (im ZIP: `react/public/bilder`) | Freigestellte Hunde, Videoclips, Quizfotos, Logo |
| **Quell-Repository** | GitHub `pendlroman-star/td-vorschau-efh53c` | Zugang auf Anfrage bei Roman |

Die React-Fassung wurde Bild für Bild gegen den Prototyp verglichen (Computer 1440 px, Tablet 820 px,
Smartphone 390 px; Startseite, Quiz, Formular, Fußzeile, Ergebnisseite aller Hunde, Ersatzbilder). Texte und Daten
sind zeichengleich, der ganze Ablauf vom Quiz bis zur Ergebnisseite wurde durchgespielt, ohne Fehlermeldungen.

## 3. In 3 Minuten starten

```bash
cd react
npm install
npm run dev          # http://localhost:5173/
```

`npm run build` erzeugt fertige statische Dateien in `../react-vorschau` (relative Pfade – läuft auch in einem
Unterordner). Node.js 22 oder neuer. Mehr in `README.md`.

> **Bilder:** Im Repository ist `react/public/bilder` ein Verweis (Symlink) auf `../../bilder`. Im ZIP-Paket liegen
> dort die echten Dateien. Wie man den Verweis ersetzt, steht in `README.md`.

## 4. Ablauf für Besucher

1. **Startseite** – Überschrift „Wer ist dein tierischer Doppelgänger?“, daneben ein **Slider mit 6 bewegten Hunden**
   (wechselt automatisch alle ~3 s, weiche Überblendung, sichtbarer Pause-Knopf).
2. **Quiz** – 5 Fragen mit je 6 Antworten (jede Antwort gehört zu einer Rasse). Fortschritt oben, „Zurück“ möglich.
3. **Formular** – „Wuff! Wir haben deinen tierischen Doppelgänger gefunden!“: Anrede*, Vorname*, Nachname*,
   E-Mail*, Telefon (optional), Newsletter (optional), Datenschutz*. Erst danach gibt es das Ergebnis.
4. **Analyse** – ca. 6 Sekunden Übergang „Dein Doppelgänger wird analysiert …“ (bewusst so lang, Kundenwunsch),
   endet mit „Match gefunden!“ und dem bewegten Hund.
5. **Ergebnisseite** `ergebnis.html?hund=<id>&echo=<n>` – „Maria, in dir steckt ein Labrador Retriever.“,
   4 Eigenschaften, Charaktertext, eine Zeile zur eigenen Quizantwort („Du hast gesagt: …“), der Brief des
   Tierheimhundes, Spendenbereich, Ausblick „Dein Match ist erst der Anfang“.

Personalisierung: Der Vorname wird nur im `sessionStorage` (`tdg-vorname`) gehalten, nie in der Adresse.

## 5. Wo was steht

| Was | Datei |
|---|---|
| Quizfragen und Antworten | `src/data/quiz.ts` |
| Hunde: Namen, Eigenschaften, Ergebnistexte, Brief, Echo-Zeilen, Fotos, Clips | `src/data/hunde.ts` |
| Einstellungen: Zeiten, Adresse des Anmeldeformulars, Nummer des Spendenwidgets | `src/data/config.ts` |
| Feste Seitentexte (Hero, FAQ, Fußzeile …) | jeweilige Komponente in `src/components/` |
| Farben, Schriften, Abstände (Design-Tokens) | `src/index.css` (`@theme`) |
| Video-Technik | `src/lib/clips.ts`, `src/components/landing/heroSliderController.ts` |

Platzhalter in Texten: `{name}` = Name des Tierheimhundes, `{vorname}, ` = persönliche Anrede (fehlt der Vorname,
fällt die Anrede weg und der Satz beginnt groß).

## 6. Die bewegten Hunde – bitte nicht vereinfachen

Die Hunde sind KI-generierte Clips mit **durchsichtigem Hintergrund**. Das ist der heikelste Teil der Seite; die
Logik wurde über viele Runden mit dem Kunden abgestimmt und auf echten Geräten geprüft.

- **Zwei Videoformate**, weil es keinen gemeinsamen Nenner gibt:
  Safari/iPhone (WebKit) spielt Transparenz nur als **HEVC mit Alphakanal** (`*-hevc.mov`), alle anderen Browser nur
  als **WebM/VP9 mit Alpha** (`*.webm`). Die Wahl erfolgt nach Browser-Engine (`'GestureEvent' in window`).
  Achtung: Die `.mov`-Dateien wurden mit Apples AVAssetWriter erzeugt – mit ffmpeg erzeugte HEVC-Alpha-Dateien
  spielt Safari **nicht** ab.
- **Absicherung:** Startet ein Video nicht innerhalb von 1,6 s (Stromsparmodus, ältere Geräte), schaltet die Seite
  automatisch auf **animierte WebP-Bilder** um (`*-anim.webp`, `*-schleife-anim.webp`). Testen mit `?ersatz=1`.
- **Nahtlose Schleifen:** Auf Analyse und Ergebnisseite laufen zwei Videos übereinander und werden an vermessenen
  Stellen (`SCHLEIFE` in `hunde.ts`) kurz überblendet – kein sichtbarer Rücksprung. Im Slider ist jeder Hund
  kürzer zu sehen, als sein Clip dauert, daher gibt es dort nie einen Schnitt.
- **Größen und Schärfe** sind je Rasse abgestimmt (Schäferhund und Labrador groß, Dackel/Havaneser/Jack kleiner).
  Die Werte stecken in den Clips und in `hundeClip(…)` – nicht „vereinheitlichen“.
- **„Bewegung reduzieren“** im Betriebssystem: Standbilder, Slider startet angehalten.
- Neue Clip-Dateien? `CLIP_VERSION` in `hunde.ts` erhöhen, sonst zeigen Browser alte Dateien aus dem Zwischenspeicher.
- Die Dateien `bilder/hunde/video/*-lang.*` werden nicht mehr verwendet und können entfallen.
- Werkzeuge zur Herstellung neuer Clips (Venice-KI, Freistellung, Formate, Schleifen) liegen bei Roman.

## 7. Formulare und Anbindung an aktivertierschutz.at

### Spendenformular (fertig vorbereitet)
- Auf allen Adressen unter **`aktivertierschutz.at`** wird automatisch das **echte Spendenwidget** als iframe geladen:
  `https://formulare.aktivertierschutz.at/embed/product?productid=115` – mit `allow` und `sandbox` exakt wie im
  Einbettungscode des Anbieters, plus dessen drei Skripte (Höhenanpassung).
- Überall sonst (Testseite, lokal) verweigert der Anbieter die Einbettung. Dort steht eine **Nachbildung** zur
  Vorschau (10 / 18 / 25 €, 18 € vorgewählt), die nichts absendet.
- Die **Beträge im echten Formular** stellt der Formularanbieter ein, nicht diese Seite.
- Die Nummer steht in `src/data/config.ts` (`spendenProduktId`).

### Anmeldeformular nach dem Quiz (noch offen)
- Vorgesehen ist ein iframe. Adresse in `src/data/config.ts` → `formularUrl` eintragen; solange leer, erscheint das
  eingebaute Platzhalter-Formular (sendet nichts).
- Nach dem Absenden muss das iframe der Seite Bescheid geben, damit die Analyse startet und die Ergebnisseite den
  Vornamen kennt:
  ```js
  parent.postMessage({ type: 'tdg:formular-gesendet', vorname: 'Maria' }, '*')
  ```

### Wo die Seite laufen muss
Der Build ist rein statisch (HTML, JS, CSS, Bilder) und läuft in jedem Unterordner. Damit das echte Spendenwidget
erscheint, muss die Seite **unter einer Adresse von aktivertierschutz.at** liegen (z. B. Unterordner oder Subdomain).

## 8. Kundenentscheidungen – bitte so lassen

- Slider **ohne** Pfeile, Punkte oder Vorschaubilder; läuft automatisch, nur die Rasse steht unter dem Hund.
- **Sichtbarer Pause-Knopf** im Slider (Barrierefreiheit, WCAG 2.2.2).
- **Weiche Überblendung** beim Hundewechsel, ca. 3 s je Hund; keine Icons im Slider.
- Im Slider und in der Analyse **KI-Hunde** (Hinweis „KI-generiert“ in der Fußzeile); echte Tierheimhunde nur auf der Ergebnisseite.
- Kopfzeile nur mit **„Über uns“** (öffnet die Kontaktseite in neuem Tab).
- CI-Akzent **Rot #c3443f** (Siegel, Spendenknöpfe, Knopf „Jetzt Quiz starten“ im grünen Balken).
- Ergebnisseite: **4 Eigenschaften**; der Hund steht **vor** den Icons, nur zwei Icons (Herz oben rechts, Pfote unten links).
- Spendenvorschläge **10 / 18 / 25 €**.
- Analyse bewusst **ca. 6 Sekunden**.

## 9. Barrierefreiheit (umgesetzt)

Sprunglink „Direkt zum Quiz“, Landmarks, Karussell mit `aria-roledescription`, sichtbarer Pause-/Abspielknopf,
Rücksicht auf „Bewegung reduzieren“, sichtbare Fokusrahmen, Formular-Beschriftungen mit Fehlermeldungen
(`aria-invalid`, `role="alert"`), `aria-live` für den Quizfortschritt, gut lesbare Schrift (Atkinson Hyperlegible).

## 10. Getestet

| Prüfung | Ergebnis |
|---|---|
| Build, TypeScript (strict), Lint | ohne Fehler |
| Bildvergleich Prototyp ↔ React (3 Breiten, alle Seitenteile) | gleich (Abweichungen nur durch Zeitpunkt der Animationen) |
| Ganzer Ablauf Quiz → Formular → Analyse → Ergebnis | funktioniert, Vorname wird übernommen |
| Videos in Chrome, Pause-Knopf, Ersatzbilder (`?ersatz=1`) | funktioniert |
| Safari 18.6 am Mac (Prototyp, gleiche Technik) | Videos laufen |
| **Nicht getestet** | iPhone/iPad-Geräte im Livebetrieb, echtes Spendenwidget (nur unter aktivertierschutz.at möglich), Anmelde-iframe (gibt es noch nicht) |

## 11. Vor dem Livegang

Alle Stellen sind im Code mit „VOR DEM LIVEGANG ENTFERNEN“ markiert (Details in `README.md`).

- [ ] **Testmenü** auf der Ergebnisseite entfernen (`components/dev/TestMenu.tsx`)
- [ ] **Geräteansicht** entfernen (`components/dev/DeviceSwitch.tsx`, `GeraeteApp.tsx`, `geraete.html`, Eintrag in `vite.config.ts`)
- [ ] **Variante „Natur“** (`?stil=natur`) und Ordner `bilder/hunde/natur/` entfernen
- [ ] **Anmeldeformular** einbinden (`formularUrl`) und `postMessage` mit Vorname prüfen
- [ ] **Spendenwidget 115** unter aktivertierschutz.at prüfen: Beträge 10/18/25 €, Zahlungsarten, Höhe
- [ ] **Platzhalter** ersetzen: Namen und Fotos der Tierheimhunde (nur „Moritz“ ist echt), Links in der Fußzeile (`#`)
- [ ] **Texte der Ergebnisseite**: der Kunde liefert noch gekürzte Fassungen
- [ ] Bankdaten (IBAN/BIC) in der Fußzeile prüfen
- [ ] **Schriften selbst hosten** (Datenschutz; derzeit Google Fonts)
- [ ] **Suchmaschinen**: `noindex`, `robots.txt` und `X-Robots-Tag` sind für die Testphase gesetzt – für den Livebetrieb entscheiden
- [ ] Nicht genutzte Videos `*-lang.*` entfernen
- [ ] Test auf echten Geräten: iPhone (Safari), Android (Chrome), Desktop (Safari, Chrome, Firefox, Edge)

## 12. Offene Fragen an den Kunden

1. Adresse des Anmeldeformulars (iframe) – und kann es den Vornamen per `postMessage` zurückmelden?
2. Spendenwidget 115 ist eingebaut. Die Knöpfe „Jetzt monatlich helfen“ auf der Ergebnisseite springen zum Formular und sollen „monatlich“ vorauswählen – in das echte iframe kann die Seite aber nicht hineingreifen. Ist 115 schon auf „monatlich“ voreingestellt, oder gibt es dafür ein eigenes Widget bzw. einen Adress-Zusatz?
3. Echte Namen, Fotos und Texte der sechs Tierheimhunde.
4. Gekürzte Texte für die Ergebnisseite.
5. Unter welcher Adresse soll das Quiz laufen (Unterordner oder Subdomain von aktivertierschutz.at)?

## 13. Ansprechpartner

Konzept, Gestaltung, Hunde-Animationen: **Roman Pendl** (Form und Zeichen).
