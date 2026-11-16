# Tierischer Doppelgänger – React-Fassung

Quiz-Landingpage für **Arche Noah – Aktiver Tierschutz Austria**, portiert aus dem statischen Prototyp
(`../index.html`, `../ergebnis.html`, `../daten.js`) nach **React 19 + Vite + TypeScript + Tailwind CSS 4**.
Aussehen, Texte, Abläufe und Adressen sind identisch mit dem Prototyp.

## Schnellstart

Voraussetzung: Node.js 22 oder neuer (getestet mit Node 24) und npm.

```bash
cd react
npm install
npm run dev        # Entwicklungsserver mit Hot Reload → http://localhost:5173/
npm run build      # Typprüfung + Build nach ../react-vorschau
npm run preview    # gebauten Stand lokal ansehen
npm run typecheck  # nur TypeScript prüfen
npm run lint       # oxlint (Lint-Werkzeug der aktuellen Vite-Vorlage)
```

Der Build verwendet relative Pfade (`base: './'`) und funktioniert daher auch in einem Unterordner
(z. B. `https://example.at/quiz/`). Ausgabeordner ist **`../react-vorschau`** (neben diesem Ordner);
er wird bei jedem Build geleert.

## Seiten (mehrseitiger Build, kein Router)

| Datei | Einstieg | Inhalt |
|---|---|---|
| `index.html` | `src/main-index.tsx` → `pages/Landing.tsx` | Hero mit Hunde-Slider, Quiz (5 Fragen), Formular, Übergang, Zitat, FAQ, grüner Balken, Fußzeile |
| `ergebnis.html?hund=<id>&echo=<1–5>` | `src/main-ergebnis.tsx` → `pages/Result.tsx` | Ergebnis: Charakter, Brief des Hundes, Spendenbereich, „Dein Match ist erst der Anfang“ |
| `geraete.html` | `src/main-geraete.tsx` | **nur Test:** Geräteansicht (Tablet/Smartphone im iframe) |
| `public/landingpage.html` | – (statisch) | alte Adresse, leitet auf `index.html` weiter |
| `public/robots.txt` | – (statisch) | sperrt Suchmaschinen (Testseite) |

Kennungen für `?hund=`: `schaeferhund`, `jack`, `dackel`, `havaneser`, `collie`, `labrador`
(ohne/unbekannt → Border Collie). Weitere Adress-Parameter:

- `?echo=1…5` – welche Quizantwort die Echo-Zeile aufgreift (Standard 5)
- `?ersatz=1` – erzwingt den WebP-Ersatz statt Video (zum Testen, siehe unten)
- `?stil=natur` – Variante „Natur“ der Ergebnisseite (nur zum Vergleich, siehe „Vor dem Livegang“)

Gespeichert wird nur in `sessionStorage` (nie in der Adresse):
`tdg-vorname` (Vorname aus dem Formular), `tdg-ankunft` (Kreis-Übergang nach dem Quiz, gilt einmal),
`tdg-testmenue` (Testmenü offen/zu).

## Ordnerstruktur

```
react/
├─ index.html, ergebnis.html, geraete.html   HTML-Einstiege (Meta, robots noindex, Google Fonts)
├─ public/
│  ├─ bilder → ../../bilder                   SYMLINK auf die Bilder/Videos des Prototyps (siehe unten)
│  ├─ landingpage.html, robots.txt
├─ src/
│  ├─ index.css                Tailwind 4: Design-Tokens (@theme), Grundstile, Breakpoints
│  ├─ styles/clips.css         Ebenen Standbild/Video/WebP eines bewegten Hundes (gemeinsam)
│  ├─ styles/marker.css        grüner Marker unter Wörtern
│  ├─ data/
│  │  ├─ hunde.ts              HUNDE: Namen, Eigenschaften, Clips, Ergebnistexte, Brief, Echo-Zeilen
│  │  ├─ quiz.ts               QUIZ: Fragen und Antworten (je Rasse eine)
│  │  ├─ config.ts             CONFIG: Zeiten, Formular-URL, Produkt-ID des Spendenformulars
│  │  ├─ komposition.ts        Lage/Größe der Formen je Hund (Slider + Ergebnisbild)
│  │  ├─ icons.ts              Arche-Icon-Set (Pfade)
│  │  └─ formen.ts             die fünf organischen Formen (SVG-Pfade)
│  ├─ lib/
│  │  ├─ clips.ts              Video-Engine: HEVC/WebM, Schleife mit Überblendung, Wachhund, WebP-Ersatz
│  │  ├─ quiz.ts               Auswertung (Sieger, Gleichstand, Echo-Frage, Mischen)
│  │  ├─ text.ts               Platzhalter {name}/{vorname}, sessionStorage-Schlüssel
│  │  ├─ motion.ts             kleine Helfer für Web-Animationen
│  │  └─ env.ts                Live-Seite?, iframe?, „Bewegung reduzieren“
│  ├─ hooks/                   useReveal (Einblenden), useScrolled (Header), useAuftritt (Ergebnisseite)
│  ├─ components/
│  │  ├─ ui/                   Button, Wrap (Inhaltsbreite), RichText (🐾/❤️ als Grafik), ClipHost, Icons
│  │  ├─ layout/               SiteHeader, SiteFooter
│  │  ├─ landing/              Hero, HeroSlider (+ heroSliderController.ts), PauseButton, Quiz,
│  │  │                        QuizSteps, QuizQuestion, FormGate, Analysis, QuoteBand, Faq, CtaBand
│  │  ├─ result/               ResultHero, ResultVisual, ResultCard, Letter, TrueLoveBadge,
│  │  │                        DonationSection, DonationPreviewForm, MatchSection
│  │  └─ dev/                  NUR TEST: TestMenu, DeviceSwitch, GeraeteApp
│  └─ pages/                   Landing.tsx, Result.tsx
└─ vite.config.ts              base './', outDir ../react-vorschau, drei Einstiege
```

## Wo stehen die Texte?

- **Quizfragen und Antworten:** `src/data/quiz.ts` (jede Antwort gehört genau einer Rasse und zählt einen Punkt;
  bei Gleichstand entscheidet die spätere Frage – siehe `src/lib/quiz.ts`).
- **Ergebnistexte je Hund** (Charakter, Begrüßung, Brief, Bitte, Knopftext, Echo-Zeilen, Fotos):
  `src/data/hunde.ts` → `HUNDE[…].ergebnis`. Platzhalter: `{name}` = Name des Hundes, `{vorname}, ` = Anrede
  (fehlt der Vorname, fällt die Anrede weg und der Satz beginnt groß). 🐾 und ❤️ in den Texten werden
  automatisch als Arche-Grafik gezeigt (`components/ui/RichText.tsx`).
- **Feste Seitentexte** (Hero, FAQ, Zitat, Fußzeile, Formular, Spendenbereich) stehen direkt in den Komponenten.
- **Einstellungen:** `src/data/config.ts` – Slider-Zeiten, Dauer des Übergangs, `formularUrl`
  (echtes E-Mail-Formular als iframe; leer = Platzhalter-Formular) und `spendenProduktId` (Spendenwidget).

Das echte E-Mail-Formular (iframe) muss nach dem Absenden der Seite Bescheid geben:
`parent.postMessage({ type: 'tdg:formular-gesendet', vorname: 'Maria' }, '*')`.

## Bewegte Hunde: Video-Engine und Ersatz

Alles in `src/lib/clips.ts` (Logik unverändert aus `daten.js` übernommen) und für den Slider in
`src/components/landing/heroSliderController.ts`. Dieser Teil arbeitet **bewusst direkt mit dem DOM**:
Die Abläufe sind auf Millisekunden abgestimmt, und der Ersatz tauscht `<video>`-Elemente gegen Bilder aus.
React stellt nur die Träger-Elemente bereit (`components/ui/ClipHost.tsx`, `HeroSlider.tsx`).

- **Safari/iPhone vs. andere Browser:** Durchsichtige Videos kann WebKit nur als **HEVC mit Alphakanal**
  (`bilder/hunde/video/*-hevc.mov`, mit Apples AVAssetWriter erzeugt), alle anderen nur als **WebM/VP9 mit Alpha**
  (`*.webm`). Gewählt wird nach Engine (`'GestureEvent' in window`), nicht nach Fähigkeit – Chrome am Mac
  spielt HEVC zwar, aber ohne Transparenz.
- **Slider:** Clips werden erst kurz vor ihrem Auftritt geladen; Überblendung 800 ms, Hund wechselt nach
  3 s (bewegt) bzw. 3,5 s (Standbild). Pausiert bei Maus über dem Slider (nur Wechsel), Tab im Hintergrund,
  Slider außer Sicht und über den Pause-Knopf.
- **Dauerschleife** (Auswertung, Ergebnisseite): zwei Videos desselben Clips liegen übereinander; an den
  vermessenen Punkten `SCHLEIFE` in `data/hunde.ts` wird kurz (60 ms) überblendet, damit kein Rücksprung sichtbar ist.
- **Wachhund + Ersatz:** Ist ein Video nach 1,6 s nicht über 0,05 s hinausgekommen, schaltet die Seite für
  **alle** Hunde auf **animiertes WebP** um (`*-anim.webp` im Slider, `*-schleife-anim.webp` als Schleife),
  geladen als Blob-Adresse, damit die Animation bei jedem Auftritt von vorne beginnt.
  **`?ersatz=1`** erzwingt diesen Ersatz zum Testen.
- **Automatisches Abspielen blockiert** (z. B. Stromsparmodus): Videos starten bei der ersten Berührung,
  dem ersten Klick oder Tastendruck.
- **„Bewegung reduzieren“** im System: Standbilder statt Videos, Slider startet angehalten, keine Einblende-Animationen.
- Neue Clip-Dateien? `CLIP_VERSION` in `data/hunde.ts` erhöhen (Cache-Bremse `?v=`).
- Die Dateien `bilder/hunde/video/*-lang.*` werden derzeit nicht verwendet.

## Spendenformular: Live-Regel

Auf Hosts, die auf **`aktivertierschutz.at`** enden (`/(^|\.)aktivertierschutz\.at$/`, siehe `lib/env.ts`),
bindet `components/result/DonationSection.tsx` das **echte Formular** ein:
iframe `https://formulare.aktivertierschutz.at/embed/product?productid=<CONFIG.spendenProduktId>` (derzeit **115**)
mit `allow="clipboard-write;payment"` und `sandbox="…"` wie im Einbettungscode des Anbieters, plus die drei
Skripte des Anbieters (`iFrameResizer.min.js`, `IFrameRegistration.js`, `fso-forms-api-parent.js`).
Überall sonst blockiert der Anbieter das iframe; dort erscheint eine **Nachbildung**
(`DonationPreviewForm.tsx`, 10/18/25 €, 18 € vorgewählt), die nichts sendet.

## Vor dem Livegang entfernen

Alle Stellen sind im Code mit „VOR DEM LIVEGANG ENTFERNEN“ markiert. Auf `*.aktivertierschutz.at`
erscheinen sie ohnehin nicht, sie sollten aber trotzdem raus:

1. **Testmenü** (Ergebnis/Echo umschalten): `components/dev/TestMenu.tsx` und die Zeile in `pages/Result.tsx`.
2. **Geräteansicht:** `components/dev/DeviceSwitch.tsx` + Zeile in `components/layout/SiteHeader.tsx`,
   `components/dev/GeraeteApp.tsx`, `geraete.html`, `src/main-geraete.tsx` und der Eintrag `geraete` in `vite.config.ts`.
3. **Variante „Natur“** (`?stil=natur`): `naturSzene()` in `lib/clips.ts`, der `natur`-Zweig in
   `components/result/ResultVisual.tsx` (inkl. `UMRISS`), `stilNatur` in `pages/Result.tsx`,
   die `.r-szene`-Regeln in `resultVisual.css` und der Ordner `bilder/hunde/natur/`.
4. Prüfen: `robots.txt`, `<meta name="robots" content="noindex, nofollow">` in den HTML-Dateien und der
   `X-Robots-Tag` in der Netlify-Konfiguration sperren derzeit Suchmaschinen – für den Livebetrieb entscheiden.
5. Schriften selbst hosten (Datenschutz) – im Prototyp über Google Fonts (`<link>` in den HTML-Dateien).
6. Platzhalter: Namen/Fotos der Hunde außer „Moritz“ sind Platzhalter (`platzhalter: true` in `data/hunde.ts`),
   Fußzeilen-Links zeigen auf `#`.

## `public/bilder` ist ein Symlink

`public/bilder` zeigt per **relativem Symlink** auf `../../bilder` (die rund 70 MB Bilder und Videos des
Prototyps), damit nichts doppelt im Repository liegt. Vite folgt dem Link: im Entwicklungsserver und beim
Build werden echte Dateien nach `../react-vorschau/bilder` kopiert.

Kann eure Umgebung keine Symlinks (z. B. Windows ohne Entwicklermodus, manche CI-Systeme oder ZIP-Exporte):

```bash
cd react
rm public/bilder                 # nur den Link entfernen
cp -R ../bilder public/bilder    # echte Dateien hineinkopieren
```

Alle Bild- und Videopfade sind relativ (`bilder/…`), es muss also nichts im Code geändert werden.

## Technische Hinweise

- **Tailwind CSS 4** über `@tailwindcss/vite`. Design-Tokens in `src/index.css` (`@theme`): Farben
  (`bg-forest`, `text-lime-600`, `bg-red`, `bg-cream`, `bg-sand`, `bg-paper` …), Schriften (`font-fun`,
  `font-head`, `font-body`), Kurven (`ease-smooth`, `ease-spring`), Schatten (`shadow-sm`, `shadow-lg`).
  Die Standardfarben von Tailwind sind bewusst abgeschaltet – nur Markenfarben.
- **Ohne Preflight:** Tailwinds Reset ist nicht eingebunden, weil der Prototyp auf den Browser-Standards
  aufbaut (Absatzabstände, Formularelemente). Die wenigen Grundregeln stehen in `index.css` (`@layer base`).
- **Breakpoints wie im Prototyp (max-width):** `tablet:` gilt bis 900 px, `phone:` bis 520 px.
- Layout, Abstände, Schrift und Farben stehen als Tailwind-Klassen in den Komponenten. Wo das unlesbar oder
  unmöglich wäre (Keyframes, Slider-Choreografie, Video-Ebenen, Kreisschrift der Siegel, Masken,
  Rastervorlagen, Nachbildung des Fremdformulars), liegt CSS in `@layer components` in einer Datei neben der
  Komponente. Diese Dateien verwenden die Theme-Variablen (`var(--color-forest)` …).
- Klassen dieser CSS-Dateien dürfen nicht wie Tailwind-Utilities heißen (z. B. nicht `shadow`, `hidden`,
  `contents`), sonst greifen beide.
- `--header-h` (76 px, unter 900 px 64 px) ist eine normale CSS-Variable in `:root`.
- Barrierefreiheit wie im Prototyp: Sprunglink „Direkt zum Quiz“, Landmarks, Karussell mit
  `aria-roledescription`, **sichtbarer** Pause-/Abspielknopf (WCAG 2.2.2), `prefers-reduced-motion`,
  Fokusrahmen, Formular-Labels mit `aria-invalid`/`role="alert"`, `aria-live` für den Quizfortschritt.

## Bewusste Abweichungen vom Prototyp

- `ergebnis.html` hat jetzt ebenfalls `noindex, nofollow` (Prototyp: nur `noindex`).
- Spendenvorschau: Im Prototyp erbte der Knopf „Mastercard“ (Klasse `mc`) versehentlich die Kartenstile der
  Ergebniskarte `.mc` (weißer Kasten mit Schatten). Hier sieht er aus wie die übrigen Zahlungsknöpfe.
- Knöpfe haben auf beiden Seiten den Druckeffekt (im Prototyp nur auf der Startseite);
  Hover-Effekte greifen (Tailwind-Standard) nur auf Geräten mit Maus.
- Die Geräteansicht (`geraete.html`) ist eine React-Seite statt statischem HTML; Verhalten gleich.
- Das Hauptskript ist **renderblockierend** (`blocking="render"`, gesetzt vom kleinen Plugin `renderBlockieren`
  in `vite.config.ts`) und React zeichnet die Seite beim Start synchron (`flushSync` in `main-*.tsx`).
  Grund: Der weiche Seitenwechsel vom Quiz zur Ergebnisseite (View Transition `match-hund`) braucht die fertige
  Seite schon beim ersten Bild – der statische Prototyp hat das von selbst, eine React-Seite sonst nicht.
