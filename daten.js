/* ==================================================================
   TIERISCHER DOPPELGÄNGER – gemeinsame Daten für Landingpage und Ergebnisseite
   ------------------------------------------------------------------
   Je Charakter:
   · name, bild (freigestellt), fokus (Kopf im runden Vorschaubild)
   · eigenschaften (die ersten drei erscheinen im Slider-Schild)
   · icons (max. 3, passend zu den Eigenschaften – siehe ICONS unten)
   · ergebnis: Inhalt der Ergebnisseite. Der Hund dort ist ein echter
     Hund aus dem Tierheim. Nur „Moritz" stammt aus dem Figma-Entwurf –
     die anderen Namen, Fotos und Texte sind PLATZHALTER/Vorschläge.
   ================================================================== */
const HUNDE = [
  { id: 'schaeferhund', name: 'Schäferhund', bild: 'bilder/hunde/schaeferhund.webp', fokus: '68% 15%',
    eigenschaften: ['loyal', 'beschützend', 'zuverlässig', 'verantwortungsbewusst', 'diszipliniert', 'zielstrebig'],
    icons: ['schild', 'medaille', 'schluessel'],
    ergebnis: { platzhalter: true, tiername: 'Bruno', er: 'er',
      headline: 'Auf dich kann man bauen – in jeder Lebenslage.',
      text: 'Genau deshalb haben wir jemanden für dich. Einer, der genauso treu an deiner Seite steht, wie du an der Seite deiner Liebsten.',
      sagt: 'Hi, ich bin Bruno und ich pass auf dich auf',
      foto: null, foto2: null } },
  { id: 'jack', name: 'Jack Russell Terrier', bild: 'bilder/hunde/jack-russell.webp', fokus: '56% 36%',
    eigenschaften: ['energiegeladen', 'mutig', 'abenteuerlustig', 'spontan', 'temperamentvoll', 'unerschrocken'],
    icons: ['blitz', 'gipfel', 'tempo'],
    ergebnis: { platzhalter: true, tiername: 'Flitzi', er: 'sie',
      headline: 'Stillsitzen? Ist so gar nicht deins!',
      text: 'Genau deshalb haben wir jemanden für dich. Eine, die schon an der Tür wartet, bevor du überhaupt „Gassi“ sagen kannst.',
      sagt: 'Hi, ich bin Flitzi und ich bin immer startklar',
      foto: 'bilder/quiz/frage-2.jpg', fokus: '62% 40%', foto2: 'bilder/quiz/ergebnis.jpg', fokus2: '60% 40%' } },
  { id: 'dackel', name: 'Dackel', bild: 'bilder/hunde/dackel-links.webp', fokus: '23% 21%',
    eigenschaften: ['selbstbewusst', 'charmant', 'eigenwillig', 'hartnäckig', 'clever', 'unabhängig'],
    icons: ['krone', 'fliege', 'eigenweg'],
    ergebnis: { platzhalter: true, tiername: 'Fritzi', er: 'sie',
      headline: 'Du gehst deinen eigenen Weg – und zwar mit Stil.',
      text: 'Genau deshalb haben wir jemanden für dich. Eine, die ebenfalls ganz genau weiß, was sie will – und dich trotzdem im Handumdrehen um die Pfote wickelt.',
      sagt: 'Hi, ich bin Fritzi und ich hab meinen eigenen Kopf',
      foto: null, foto2: null } },
  { id: 'havaneser', name: 'Havaneser', bild: 'bilder/hunde/havaneser.webp', fokus: '67% 32%',
    eigenschaften: ['herzlich', 'feinfühlig', 'lebensfroh', 'gesellig', 'harmoniebedürftig', 'anhänglich'],
    icons: ['herz', 'feder', 'sonne'],
    ergebnis: { platzhalter: true, tiername: 'Bella', er: 'sie',
      headline: 'Bei dir fühlen sich alle sofort wohl.',
      text: 'Genau deshalb haben wir jemanden für dich. Eine, die ihr Herz genauso schnell verschenkt wie du.',
      sagt: 'Hi, ich bin Bella und ich kuschle für mein Leben gern',
      foto: null, foto2: null } },
  { id: 'collie', name: 'Border Collie', bild: 'bilder/hunde/border-collie.webp', fokus: '64% 36%',
    eigenschaften: ['intelligent', 'aufmerksam', 'fokussiert', 'ehrgeizig', 'lernfreudig', 'perfektionistisch'],
    icons: ['gluehbirne', 'lupe', 'ziel'],
    ergebnis: { platzhalter: false, tiername: 'Moritz', er: 'er',      // aus dem Figma-Entwurf
      headline: 'Du hast bei der Lacke nicht lange überlegt: durch!',
      text: 'Genau deshalb haben wir jemanden für dich. Einer, der wahrscheinlich schon in der Lacke wäre, bevor du überhaupt deine Schuhe ausgezogen hast.',
      sagt: 'Hi, ich bin Moritz und ich liebe Abenteuer',
      foto: 'bilder/quiz/frage-3.jpg', fokus: '55% 45%', foto2: 'bilder/ergebnis/collie-2.jpg', fokus2: '45% 50%' } },
  { id: 'labrador', name: 'Labrador Retriever', bild: 'bilder/hunde/labrador.webp', fokus: '62% 22%',
    eigenschaften: ['kontaktfreudig', 'gutmütig', 'genussfreudig', 'offen', 'unkompliziert', 'begeisterungsfähig'],
    icons: ['sprechblase', 'smiley', 'knochen'],
    ergebnis: { platzhalter: true, tiername: 'Balu', er: 'er',
      headline: 'Gutes Essen, gute Leute – mehr braucht’s nicht.',
      text: 'Genau deshalb haben wir jemanden für dich. Einer, der jeden Tag mit einem Lächeln beginnt – und am liebsten mit einem Leckerli beendet.',
      sagt: 'Hi, ich bin Balu und ich mag einfach jeden',
      foto: 'bilder/quiz/frage-1.jpg', fokus: '45% 30%', foto2: null } },
];

/* ------------------------------------------------------------------
   ICONS (handgezeichnet, 48 × 48) – jeder Strich wird beim Wechsel
   „nachgezeichnet". Bedeutung steht jeweils dahinter.
   ------------------------------------------------------------------ */
const ICONS = {
  schild:      ['M24 5.5c5 3 10.4 4.3 15.4 4.2.4 13.6-4.1 24.6-15.4 32.8C12.7 34.3 8.2 23.3 8.6 9.7c5 .1 10.4-1.2 15.4-4.2z', 'M17 23.5l5 5 9.5-10'],                       // beschützend
  medaille:    ['M16.5 4.5l6 13', 'M31.5 4.5l-6 13', 'M24 17.5c5.9-.1 10.5 4.6 10.4 10.4-.1 5.7-4.7 10.2-10.5 10.1-5.7-.1-10.2-4.6-10.2-10.3.1-5.8 4.6-10.2 10.3-10.2z', 'M24 22.3l1.7 3.5 3.8.5-2.8 2.6.7 3.8-3.4-1.8-3.4 1.8.7-3.8-2.8-2.6 3.8-.5z'], // zuverlässig
  schluessel:  ['M14.5 13c4.4-.1 7.8 3.4 7.7 7.7-.1 4.2-3.5 7.6-7.8 7.5-4.2 0-7.6-3.5-7.5-7.7.1-4.2 3.4-7.5 7.6-7.5z', 'M22.2 20.5H42', 'M35 20.5v6', 'M40.5 20.5v4.5', 'M12.8 20.5h.4'], // verantwortungsbewusst
  blitz:       ['M28 4.5L12.5 27.5h11L20 43.5l16.5-24.5H25.5L28 4.5z'],                                                                               // energiegeladen
  gipfel:      ['M4 41l12.5-19 7 9.5 6-8.5L44 41z', 'M29.5 23V7.5', 'M29.5 8l8.5 3-8.5 3.4'],                                                           // abenteuerlustig
  tempo:       ['M10 14.5c7-2.3 14.3-2.4 21.5-.5', 'M4.5 24.3c10-2.7 20.3-2.5 30 .4', 'M10.5 34.2c5.8-1.5 11.8-1.5 17.6 0', 'M38 13l4 4-4 4'],               // temperamentvoll, spontan
  krone:       ['M8 35L5.5 14.5l10 8.5 8.5-14 8.5 14 10-8.5L40 35z', 'M9 40.5h30', 'M24 9v.3'],                                                         // selbstbewusst
  fliege:      ['M20.5 24L7.5 15.5c-1.6 5.7-1.6 11.3 0 17z', 'M27.5 24l13-8.5c1.6 5.7 1.6 11.3 0 17z', 'M20.8 20.5h6.4v7h-6.4z'],                      // charmant
  eigenweg:    ['M5 38c8.5.2 13-5.5 13-11.5 0-4.8-5.2-7.3-7.5-3.4-2.4 4 3 9.4 10.5 9.4 8.8 0 13.7-8.4 19.5-17', 'M33.5 12.5l7.3.5-.8 7.3'],              // eigenwillig
  herz:        ['M24.3 40.5c-6.8-4.6-15.6-11.2-17.6-18.4-1.6-5.6 1.6-11.4 7-12.1 4.3-.6 8.4 2.4 10.4 6.6 1.9-4.6 6-7.6 10.6-6.9 5.6.9 8.3 7 6.3 12.6-2.4 6.9-10.5 13.3-16.9 18.1', 'M38.5 5.5l1.6-3.2', 'M43 10.2l3.4-1.2'], // herzlich
  feder:       ['M39 5.5C25.5 7.5 14.5 17.5 12 33l-4.5 9.5', 'M39 5.5c2.6 12.4-6 25-25 28', 'M21.5 17.5l7 1.2', 'M17 25l9 1.5'],                           // feinfühlig
  sonne:       ['M24 16c4.5-.1 8.1 3.5 8 8-.1 4.4-3.6 7.9-8 7.9-4.5 0-8-3.6-7.9-8 0-4.4 3.5-7.9 7.9-7.9z', 'M24 4v6', 'M24 38v6', 'M4 24h6', 'M38 24h6', 'M9.8 9.8l4.2 4.2', 'M34 34l4.2 4.2', 'M38.2 9.8L34 14', 'M14 34l-4.2 4.2'], // lebensfroh
  gluehbirne:  ['M24 5.5c-7.2 0-12.2 5.2-12 11.3.1 5 3.2 7.3 5 10 1.1 1.6 1.3 3.2 1.3 4.7h11.4c0-1.5.2-3.1 1.3-4.7 1.8-2.7 4.9-5 5-10 .2-6.1-4.8-11.3-12-11.3z', 'M19 36h10', 'M20.5 40.5h7', 'M20.8 25l3.2-4 3.2 4'], // intelligent
  lupe:        ['M20 7.5c7-.1 12.6 5.5 12.5 12.5-.1 6.8-5.7 12.4-12.6 12.3-6.8-.1-12.3-5.6-12.2-12.5C7.8 13 13.2 7.6 20 7.5z', 'M29.2 29.2L41 41', 'M13.8 16.8c1.2-2.8 3.3-4 6-4'], // aufmerksam
  ziel:        ['M24 8c8.9-.1 16.1 7.1 16 16-.1 8.7-7.3 15.9-16.1 15.8C15.2 39.7 8 32.6 8.1 23.8 8.2 15.1 15.3 8.1 24 8z', 'M24 15.5c4.7 0 8.5 3.8 8.4 8.5 0 4.6-3.8 8.4-8.5 8.4-4.6-.1-8.4-3.9-8.3-8.5 0-4.6 3.8-8.4 8.4-8.4z', 'M24 24l16-16', 'M34.5 7.5h6v6'], // fokussiert
  sprechblase: ['M8.5 9h31c2 0 3.5 1.5 3.5 3.5v16c0 2-1.5 3.5-3.5 3.5H22l-9 8v-8H8.5C6.5 32 5 30.5 5 28.5v-16C5 10.5 6.5 9 8.5 9z', 'M16.5 15.5v10', 'M16.5 20.5h6.5', 'M23 15.5v10', 'M30.5 19v6.5', 'M30.5 15.5v.4'], // kontaktfreudig
  smiley:      ['M24 6.5c9.8-.1 17.6 7.8 17.5 17.5-.1 9.6-7.9 17.4-17.6 17.3C14.3 41.2 6.5 33.4 6.6 23.8 6.7 14.2 14.4 6.6 24 6.5z', 'M17.5 19.5v2.5', 'M30.5 19.5v2.5', 'M15.5 28c4.5 5 12.5 5 17 0'], // gutmütig
  knochen:     ['M14.3 30.2l15.9-15.6c-1.3-2.5-.6-5.7 1.9-7 2.3-1.2 5.1-.3 6.1 2 .4.8.6 1.7.4 2.6 1-.3 2-.2 2.9.2 2.3 1.1 3 4 1.6 6.2-1.4 2.2-4.4 2.7-6.6 1.3L20.6 35.6c1.3 2.5.6 5.6-1.9 6.9-2.3 1.2-5.1.3-6.1-2-.4-.8-.5-1.7-.4-2.5-1 .3-2 .2-2.9-.2-2.3-1.1-3-4-1.6-6.2 1.4-2.2 4.4-2.7 6.6-1.4z'], // genussfreudig
};
const iconMarkup = name => (ICONS[name] || []).map(d => `<path pathLength="1" d="${d}"/>`).join('');

/* ------------------------------------------------------------------
   KOMPOSITION (Slider auf der Startseite + Bild oben auf der Ergebnisseite) (Werte in % der Bühnenbreite; Bühne 100 × 110)
   bubbles: [x, y, Größe, Drehung]
   icons:   [Nr. der Bubble (0–4), Winkel in Grad (0 = rechts, 90 = unten), Drehung]
            → jedes Icon sitzt genau auf dem Rand dieser Bubble und berührt sie immer
   ------------------------------------------------------------------ */
const KOMPOSITION = [
  { bubbles: [[48, 58, 112, 0], [64, 34, 66, 18], [28, 80, 50, -12], [84, 82, 46, 40], [90, 26, 9, 0]],   icons: [[0, 215, -6], [3, 330, 8], [2, 160, -8]] },
  { bubbles: [[54, 60, 108, 24], [34, 30, 62, -10], [78, 78, 52, 20], [18, 86, 42, 60], [12, 40, 8, 0]],  icons: [[1, 200, -8], [2, 0, 0], [3, 200, -4]] },
  { bubbles: [[50, 64, 114, -14], [70, 36, 60, 30], [26, 74, 56, 8], [86, 88, 40, -20], [44, 14, 7, 0]],  icons: [[1, 0, 6], [3, 330, -6], [2, 200, 0]] },
  { bubbles: [[50, 60, 110, 36], [30, 38, 64, 12], [76, 74, 54, -16], [22, 90, 42, 30], [92, 50, 8, 0]],  icons: [[2, 340, 8], [0, 165, -10], [1, 225, 0]] },
  { bubbles: [[52, 58, 112, -24], [72, 42, 64, -8], [30, 80, 52, 22], [80, 90, 44, 10], [8, 24, 9, 0]],   icons: [[0, 225, -8], [1, 10, 8], [3, 340, 0]] },
  { bubbles: [[48, 62, 108, 12], [36, 34, 62, 24], [74, 80, 54, -6], [20, 82, 46, -30], [88, 18, 8, 0]],  icons: [[1, 230, -6], [3, 190, -8], [2, 345, -20]] },
];


// Position eines Icons: sitzt immer auf dem Rand der gewählten Bubble
function iconPos(i, k) {
  const [bi, ang, r] = KOMPOSITION[i].icons[k];
  const [bx, by, bw] = KOMPOSITION[i].bubbles[bi];
  const a = ang * Math.PI / 180, RAND = .32;
  return [bx + RAND * bw * Math.cos(a), by + RAND * bw * Math.sin(a), r];
}
