/* ==================================================================
   TIERISCHER DOPPELGÄNGER – Hunde-Daten (portiert aus daten.js)
   ------------------------------------------------------------------
   Je Charakter:
   · name, bild (freigestellt), fokus (Kopf im runden Vorschaubild)
   · eigenschaften (die ersten drei erscheinen im Slider-Schild)
   · icons (max. 3, passend zu den Eigenschaften – siehe ICONS unten)
   · ergebnis: Inhalt der Ergebnisseite – Texte laut Kundenfassung vom 11.11.2026
     („ATA LC Ergebnistexte _final"): charakter, hallo (Begrüßung des Hundes),
     brief (der Hund erzählt; Art je Absatz: p / frage / wunsch / wende),
     appell, button und echo (je Quizfrage eine Zeile).
     Platzhalter in den Texten: {name} = Name des Hundes, „{vorname}, " = Anrede
     (fehlt der Vorname, fällt die Anrede weg und der Satz beginnt groß).
     Der Hund ist ein echter Hund aus dem Tierheim. Nur „Moritz" stammt aus dem
     Figma-Entwurf – die anderen Namen und Fotos sind noch PLATZHALTER.
     Hinweis: Auf der Ergebnisseite werden nur die ersten 4 Eigenschaften gezeigt (Kundenwunsch 16.11.).
   ================================================================== */
import type { IconName } from './icons'

export type HundId = 'schaeferhund' | 'jack' | 'dackel' | 'havaneser' | 'collie' | 'labrador'
/** Lage des Videos in % des Standbild-Rahmens 1000×1100: [links, oben, Breite, Höhe] */
export type Box = [number, number, number, number]
/** Art eines Brief-Absatzes auf der Ergebnisseite */
export type BriefArt = 'p' | 'frage' | 'wunsch' | 'wende'

export interface HundeClip {
  /** Schleifenbereich [von, bis] in Sekunden – null = Clip ist selbst nahtlos */
  schleife: [number, number] | null
  /** Ersatz (animiertes WebP), falls das Video nicht startet: Slider bzw. nahtlose Schleife */
  anim: string
  animSchleife: string
  webm: string
  hevc: string
  poster: string
  box: Box
  start: number
  dauer: number
  /** längere Schleife – derzeit NICHT verwendet (Dateien *-lang.* liegen nur bereit) */
  lang: { webm: string; hevc: string; poster: string; box: Box } | null
}

export interface Ergebnis {
  platzhalter: boolean
  tiername: string
  er: 'er' | 'sie'
  charakter: string
  hallo: string
  brief: [BriefArt, string][]
  appell: string
  button: string
  /** je Quizfrage 1–5 eine Zeile */
  echo: [string, string, string, string, string]
  foto: string | null
  fokus?: string
  foto2: string | null
  fokus2?: string
}

export interface Hund {
  id: HundId
  name: string
  bild: string
  fokus: string
  video: HundeClip | null
  eigenschaften: string[]
  icons: IconName[]
  ergebnis: Ergebnis
}

// Bewegte Hunde (KI-Clips mit durchsichtigem Hintergrund): WebM für Chrome/Firefox, HEVC für Safari/iPhone,
// poster = erstes Bild des Clips. box = Lage des Videos in % des Standbild-Rahmens 1000×1100 [links, oben, Breite, Höhe].
// Slider-Clips (17.10.2026): aus hochgerechneten Clips (Topaz 2×), alle in gleicher Bildpunktdichte und Nachschärfung;
// Größe abgestuft nach Rasse (Schäferhund/Labrador groß, Collie mittel, Jack Russell/Havaneser/Dackel kleiner) – box bereits fertig.
// groesse = zusätzlicher Feinausgleich;
// skaliert wird um die Bodenmitte (50 % / 100 %), die Pfoten bleiben also auf dem Schatten.
// start = Sekunde, an der der Hund im Slider einsetzt. Die Schleifen sind aus der Mitte der KI-Clips geschnitten
// (Anfang/Ende der KI-Clips frieren kurz ein und sind heller) und am Übergang weich verbunden.
const boxSkaliert = ([l, t, w, h]: Box, f: number): Box =>
  [50 + (l - 50) * f, 100 + (t - 100) * f, w * f, h * f].map(n => +n.toFixed(2)) as Box
/** bei neuen Clip-Dateien erhöhen, damit Browser nicht die alten aus dem Zwischenspeicher zeigen */
export const CLIP_VERSION = 14
// Safari/iPhone: HEVC mit Alphakanal als .mov, erzeugt mit Apples AVAssetWriter (ffmpeg-Dateien kann Safari nicht abspielen)
// lang = längere, abwechslungsreichere Schleife (5–7 s) für die Ergebnisseite; Größe dort schon ausgeglichen.
// Läuft ein Hund allein in Dauerschleife (Auswertung, Ergebnisseite), springt der Slider-Clip am Ende sichtbar zurück.
// SCHLEIFE nennt je Clip zwei Stellen [von, bis] in Sekunden, an denen Haltung UND Bewegung über mehrere Bilder
// übereinstimmen (vermessen am 12.11.2026, alle 24 Bilder je Sekunde); zwischen ihnen läuft die Schleife. Ohne Eintrag ist der Clip selbst schon nahtlos.
export const SCHLEIFE: Partial<Record<string, [number, number]>> = {
  'jack-russell': [0.583, 3.708], 'dackel': [1.417, 3.208], 'havaneser': [0.417, 3.708],
  'border-collie': [1.125, 2.792],   // die Schleichphase: läuft herein, duckt sich und schleicht dann weiter
  'labrador': [1.042, 3.167],
}
const hundeClip = (datei: string, box: Box, groesse = 1, start = 0, dauer = 5000, langBox: Box | null = null): HundeClip => ({
  schleife: SCHLEIFE[datei] || null,
  // Ersatz, falls das Video auf einem Gerät nicht startet (siehe animZeigen): Slider bzw. nahtlose Schleife
  anim: `bilder/hunde/video/${datei}-anim.webp?v=${CLIP_VERSION}`,
  animSchleife: `bilder/hunde/video/${datei}-schleife-anim.webp?v=${CLIP_VERSION}`,
  webm: `bilder/hunde/video/${datei}.webm?v=${CLIP_VERSION}`, hevc: `bilder/hunde/video/${datei}-hevc.mov?v=${CLIP_VERSION}`,
  poster: `bilder/hunde/video/${datei}-poster.webp?v=${CLIP_VERSION}`, box: boxSkaliert(box, groesse), start, dauer,
  lang: langBox && {
    webm: `bilder/hunde/video/${datei}-lang.webm?v=${CLIP_VERSION}`, hevc: `bilder/hunde/video/${datei}-lang-hevc.mov?v=${CLIP_VERSION}`,
    poster: `bilder/hunde/video/${datei}-lang-poster.webp?v=${CLIP_VERSION}`, box: langBox,
  },
})

export const HUNDE: Hund[] = [
  { id: 'schaeferhund', name: 'Schäferhund', bild: 'bilder/hunde/schaeferhund.webp', fokus: '68% 15%',
    // nur die Stehphase (wachsam umherschauen), vor- und rückwärts als nahtlose 4,3-s-Schleife (Romans Wunsch)
    video: hundeClip('schaeferhund', [-10.75, -11.58, 112.12, 111.58], 1, 0, 6875,
      [-7.55, -6.37, 106.28, 106.37]),
    eigenschaften: ['loyal', 'beschützend', 'zuverlässig', 'verantwortungsbewusst', 'diszipliniert', 'zielstrebig'],
    icons: ['arche', 'hakerl', 'haus'],
    ergebnis: { platzhalter: true, tiername: 'Bruno', er: 'er',
      charakter: 'Du bist so ein richtig toller Typ, auf den man sich verlassen kann. Du übernimmst Verantwortung und kämpfst für deine Ziele. Und dass es deinen Lieblingsmenschen gut geht, ist für dich sowieso Ehrensache.',
      hallo: 'Hey, ich bin {name}! Und ich glaub, wir zwei verstehen uns ziemlich gut!',
      brief: [
        ['p', 'Weißt du, warum? Weil wir beide immer ein Auge auf alles haben. Ob jemand zum Tor hereinkommt oder irgendwo etwas raschelt – mir entgeht so schnell nichts. Schließlich muss ja einer aufpassen!'],
        ['frage', 'Aber weißt du, was ich mir manchmal wünsche?'],
        ['wunsch', 'Dass ich einfach mal nicht aufpassen muss.'],
        ['wunsch', 'Dass ich mich hinlegen, die Augen schließen und darauf vertrauen kann, dass jemand anderes auf mich aufpasst.'],
        ['wende', 'Und genau da kommst du ins Spiel. ❤️'],
        ['p', 'Denn du weißt doch am besten, wie schön es ist, wenn man sich auf jemanden verlassen kann.'],
        ['p', 'Hier in der Arche Noah warten Hunde wie ich auf ein liebevolles Zuhause. Bis es so weit ist, brauchen wir einen sicheren Rückzugsort, gutes Futter, Pflege und Menschen, die sich um uns kümmern.'],
        ['p', 'Mit deiner monatlichen Spende hilfst du, dass ich und meine Hundefreunde genau das bekommen:'],
        ['p', 'Einen sicheren Platz in einer unserer Hundehütten. Einen Ort, an dem wir zur Ruhe kommen!'],
      ],
      appell: 'Schenk Hunden wie mir einen sicheren Platz. Monat für Monat. ❤️',
      button: 'Jetzt monatlich helfen',
      echo: [   // je Frage 1–5 eine Zeile, die die gewählte Antwort aufgreift
        'Du hast gefragt: „Wer fährt? Und wer bringt alle sicher heim?“ Du hast den Überblick, bevor der Abend überhaupt begonnen hat. Typisch Schäferhund.',
        'Du hast gesagt: „Ich fang an und hör erst auf, wenn es steht.“ Disziplin und Durchhaltevermögen sind Schäferhund-Qualitäten.',
        'Du hast gesagt: „Ich bring’s in Ordnung.“ Verantwortung zu übernehmen ist dein Ding. Wie bei einem Schäferhund.',
        'Du hast gesagt: „Keiner wird zurückgelassen.“ Selbst im Zombie-Alarm bist du die Person, auf die sich alle verlassen. Schäferhunde machen das genauso.',
        'Du hast gesagt: „Ich regle das.“ Ruhig, verlässlich, sofort da. So sind Schäferhunde.',
      ],
      foto: null, foto2: null } },
  { id: 'jack', name: 'Jack Russell Terrier', bild: 'bilder/hunde/jack-russell.webp', fokus: '56% 36%',
    video: hundeClip('jack-russell', [1.69, -12.64, 95.08, 112.64], 1, 0, 4250,
      [-21.52, -27.28, 157.38, 127.28]),
    eigenschaften: ['energiegeladen', 'mutig', 'abenteuerlustig', 'spontan', 'temperamentvoll', 'unerschrocken'],
    icons: ['funken', 'wellen', 'pfeil'],
    ergebnis: { platzhalter: true, tiername: 'Flitzi', er: 'sie',
      charakter: 'Stillsitzen ist nicht so deins. Du bist mutig, spontan und immer für Action zu haben. Langweilig wird es mit so einem Abenteurer wie dir garantiert nie!',
      hallo: 'Hey, ich bin {name}! Und ich glaub, wir zwei sind aus demselben guten Holz geschnitzt!',
      brief: [
        ['p', 'Am liebsten mittendrin im Abenteuer – hier ein spannendes Geräusch, dort etwas Neues zu entdecken. Ich muss natürlich sofort checken, was los ist. Genau wie du!'],
        ['frage', 'Aber weißt du, was selbst so ein Wirbelwind wie ich manchmal braucht?'],
        ['wunsch', 'Eine Pause. Ja, wirklich!'],
        ['wunsch', 'Einen Platz, an dem ich mich nach all meinen Abenteuern gemütlich zusammenrollen kann und einfach mal die Pfoten hochlegen darf.'],
        ['wende', 'Kannst du mir eine kleine Pause schenken? ❤️'],
        ['p', 'Denn du weißt doch selbst, wie gut es tut, nach einem aufregenden Tag endlich zur Ruhe zu kommen.'],
        ['p', 'Hier in der Arche Noah warten Hunde wie ich auf ein liebevolles Zuhause und erhalten Futter, Pflege und Menschen, die sich um uns kümmern.'],
        ['p', 'Mit deiner Spende hilfst du, dass ich und meine Hundefreunde genau das bekommen.'],
      ],
      appell: '{vorname}, bitte schenk kleinen Wirbelwinden wie mir einen Platz zum Ausruhen. Monat für Monat. ❤️',
      button: 'Jetzt monatlich helfen',
      echo: [   // je Frage 1–5 eine Zeile, die die gewählte Antwort aufgreift
        'Du fragst nicht: „Wie, was, warum.“ Genau das ist Jack-Russell-Spirit: erst starten, dann schauen.',
        'Du hast gesagt: „Akkuschrauber her und Musik aufdrehen.“ Jack Russells entscheiden schnell und machen einfach.',
        'Du hast gesagt: „Das lass ich so nicht stehen!“ Temperament und Mut zur Gegenwehr: ein echter Jack Russell.',
        'Du hast gesagt: „Ich renne laut auf die Zombies zu.“ Unerschrocken und nicht zu überhören. Jack Russell eben.',
        'Du hast gesagt: „Wir finden eine Lösung, egal wie wild es wird.“ Mutig und sofort in Aktion. Das ist typisch Jack Russell.',
      ],
      foto: 'bilder/quiz/frage-2.jpg', fokus: '62% 40%', foto2: 'bilder/quiz/ergebnis.jpg', fokus2: '60% 40%' } },
  { id: 'dackel', name: 'Dackel', bild: 'bilder/hunde/dackel-links.webp', fokus: '23% 21%',
    video: hundeClip('dackel', [6.85, 25.12, 96.95, 74.88], 1, 0, 4250,
      [-4.19, 3.2, 120.88, 96.8]),
    eigenschaften: ['selbstbewusst', 'charmant', 'eigenwillig', 'hartnäckig', 'clever', 'unabhängig'],
    icons: ['knochen', 'schlaufe', 'paragraf'],
    ergebnis: { platzhalter: true, tiername: 'Fritzi', er: 'sie',
      charakter: 'Du weißt, was du willst. Und meistens auch ziemlich genau, wie du es willst. Gute Ratschläge hörst du dir höflich an und machst dann trotzdem dein Ding. Du hast deinen eigenen Kopf, jede Menge Charme und ein richtig großes Herz.',
      hallo: 'Servus, ich bin {name}! Und ich glaub, du kannst genauso stur sein wie ich!',
      brief: [
        ['p', 'Stimmts? Wir beide wissen ganz genau, was wir wollen! Wenn ich eine spannende Spur entdecke, dann muss ich der natürlich nachgehen. Da kann jemand noch so oft meinen Namen rufen. Ein echter Dackel lässt sich sowieso nicht hetzen!'],
        ['frage', 'Aber weißt du, was ich mir wirklich wünschen würde?'],
        ['wunsch', 'Einen Platz, an dem ich einfach ich selbst sein darf.'],
        ['wunsch', 'Wo ich meine Ruhe habe, wenn mir danach ist. Wo ich mich gemütlich einkuscheln kann und niemand etwas von mir verlangt.'],
        ['wende', 'Und genau dafür brauch ich dich. ❤️'],
        ['p', 'Denn du weißt doch selbst am besten, wie wichtig es ist, einen Ort zum Abschalten zu haben.'],
        ['p', 'Hier in der Arche Noah warten Hunde wie ich auf ein liebevolles Zuhause. Auf einen geschützten Platz in einer unserer Hundehütten, wo wir uns zurückziehen, die Pfoten ausstrecken und einfach mal unsere Ruhe genießen können. Ganz nach Dackelart!'],
      ],
      appell: 'Schenk Dickköpfen mit großem Herzen einen sicheren Platz. Monat für Monat. ❤️',
      button: 'Jetzt monatlich helfen',
      echo: [   // je Frage 1–5 eine Zeile, die die gewählte Antwort aufgreift
        'Du hast gesagt: „Heute nicht. Ich hab’s mir gerade gemütlich gemacht.“ Ein Dackel sagt auch mal Nein, und das mit Charme.',
        'Du hast gesagt: „Wenn am Ende zwei Schrauben übrig sind, nennen wir das Design.“ Selbstbewusst und charmant eigenwillig. Dackel-Logik.',
        'Du hast gesagt: „Ich seh das trotzdem anders.“ Selbstbewusst und hartnäckig: Ein Dackel gibt nicht klein bei.',
        'Du hast gesagt: „Ich schleiche mich unauffällig davon.“ Clever und unabhängig, ein Dackel findet immer seinen Weg.',
        'Du hast gesagt: „Dann steh ich mit Kaffee und einer klaren Meinung vor deiner Tür.“ Nicht sofort, aber verlässlich und mit eigenem Kopf. Typisch Dackel.',
      ],
      foto: null, foto2: null } },
  { id: 'havaneser', name: 'Havaneser', bild: 'bilder/hunde/havaneser.webp', fokus: '67% 32%',
    video: hundeClip('havaneser', [-1.75, 25.22, 98.31, 74.78], 1, 0, 4250,
      [-18.4, 1.07, 131.58, 98.93]),
    eigenschaften: ['herzlich', 'feinfühlig', 'lebensfroh', 'gesellig', 'harmoniebedürftig', 'anhänglich'],
    icons: ['herz', 'pfote', 'sprechblasen'],
    ergebnis: { platzhalter: true, tiername: 'Bella', er: 'sie',
      charakter: 'Du hast ein großes Herz und ein feines Gespür für andere. Du merkst sofort, wenn jemand Nähe braucht, und bist am liebsten bei deinen Lieblingsmenschen.',
      hallo: 'Hallo, ich bin {name}! Ich hab das Gefühl, wir würden uns auf Anhieb mögen!',
      brief: [
        ['p', 'Weißt du, warum? Weil wir beide am liebsten unsere Lieblingsmenschen um uns haben. Wir brauchen gar nicht viel zum Glücklichsein. Ein freundliches Wort, ein Lächeln und vielleicht eine Kuscheleinheit. Na gut, zwei wären auch schön!'],
        ['frage', 'Aber weißt du, was ich mir manchmal am allermeisten wünsche?'],
        ['wunsch', 'Jemand, der mir zeigt, dass ich nicht allein bin.'],
        ['wende', '{vorname}, ich glaube, du verstehst das besonders gut! ❤️'],
        ['p', 'Hier in der Arche Noah warten Hunde wie ich auf ein liebevolles Zuhause. Bis wir unsere Menschen gefunden haben, brauchen wir Futter, Pflege, Zuwendung und einen geschützten Platz.'],
        ['p', 'Mit deiner monatlichen Spende schenkst du uns einen gemütlichen Rückzugsort in einer unserer Hundehütten, wo wir uns einkuscheln und sicher fühlen können. Bis wir endlich unsere eigenen Lieblingsmenschen gefunden haben.'],
      ],
      appell: 'Schenk Hunden wie mir einen kuscheligen Platz und Geborgenheit. Monat für Monat. ❤️',
      button: 'Jetzt helfen',
      echo: [   // je Frage 1–5 eine Zeile, die die gewählte Antwort aufgreift
        'Du hast gesagt: „Hauptsache, alle sind dabei und keiner bleibt außen vor.“ Harmoniebedürftig im besten Sinn: Havaneser.',
        'Du hast gesagt: „Hauptsache, kein Streit.“ Der Frieden ist dir wichtiger als das Regal. Das ist Havaneser-Feingefühl.',
        'Du hast gesagt: „Das beschäftigt mich jetzt noch drei Tage.“ Feinfühlig zu sein ist eine Stärke. Havaneser spüren eben viel.',
        'Du hast gesagt: „Hauptsache, meine Lieblingsmenschen sind bei mir.“ Anhänglich und treu, selbst im Weltuntergang. Havaneser eben.',
        'Du hast gesagt: „Ich ruf sofort an und bleib dran, bis du ruhiger bist.“ Herzlich und feinfühlig, du bist da, solange es braucht. Das ist Havaneser.',
      ],
      foto: null, foto2: null } },
  { id: 'collie', name: 'Border Collie', bild: 'bilder/hunde/border-collie.webp', fokus: '64% 36%',
    video: hundeClip('border-collie', [-6.42, -30.61, 99.87, 130.61], 1, 0, 4167,
      [-0.89, -16.53, 92.73, 116.53]),
    eigenschaften: ['intelligent', 'aufmerksam', 'fokussiert', 'ehrgeizig', 'lernfreudig', 'perfektionistisch'],
    icons: ['gluehbirne', 'lupe', 'kalender'],
    ergebnis: { platzhalter: false, tiername: 'Moritz', er: 'er',      // aus dem Figma-Entwurf
      charakter: 'Du denkst mit, denkst voraus und hast meistens schon eine Lösung, bevor andere das Problem überhaupt erkannt haben. Du bist neugierig, ehrgeizig und gibst immer dein Bestes.',
      hallo: 'Hey, ich bin {name}! Ich glaub, wir zwei haben beide ständig tausend Dinge im Kopf!',
      brief: [
        ['p', 'Weißt du, warum? Weil wir sind meistens schon drei Schritte weiter, bevor jemand „Sitz!“ gesagt hat.'],
        ['frage', 'Aber ich muss dir etwas gestehen.'],
        ['wunsch', 'Manchmal wäre ich gern einfach nur ein Hund, der sich hinlegt, die Augen schließt und darauf vertrauen kann, dass alles gut ist.'],
        ['wende', 'Du kennst dieses Gefühl bestimmt und deshalb hab ich eine Idee für dich. ❤️'],
        ['p', 'Hier in der Arche Noah warten Hunde wie ich auf ein liebevolles Zuhause. Bis dahin brauchen wir Futter, Pflege, liebevolle Betreuung und einen sicheren Rückzugsort.'],
        ['p', 'Mit deiner monatlichen Spende hilfst du, dass wir in einer unserer Hundehütten einen geschützten Platz zum Ausruhen bekommen.'],
      ],
      appell: 'Schenk klugen Köpfen wie mir einen Ort zum Abschalten. ❤️',
      button: 'Jetzt monatlich helfen',
      echo: [   // je Frage 1–5 eine Zeile, die die gewählte Antwort aufgreift
        'Du hast gesagt: „Ich hab schon drei Vorschläge recherchiert. Mit Öffnungszeiten.“ Vorbereitet und aufmerksam: Border Collie.',
        'Du hast gesagt: „Es soll ja auf den Millimeter stimmen.“ Perfektionismus ist ein Border-Collie-Klassiker.',
        'Du hast gesagt: „Ich will’s verstehen und beim nächsten Mal besser machen.“ Lernfreude und Ehrgeiz: Border Collie.',
        'Du hast gesagt: „Einen Plan B, zwei längst gepackte Überlebenskits und einen Plan C.“ Fokussiert, auch wenn die Welt untergeht. Ganz eindeutig ein Border Collie.',
        'Du hast gesagt: „Ich hör zu, sortiere die Lage und hab in fünf Minuten eine saubere Lösung parat.“ Klarer Kopf, wenn es drauf ankommt. Border Collie eben.',
      ],
      foto: 'bilder/quiz/frage-3.jpg', fokus: '55% 45%', foto2: 'bilder/ergebnis/collie-2.jpg', fokus2: '45% 50%' } },
  { id: 'labrador', name: 'Labrador Retriever', bild: 'bilder/hunde/labrador.webp', fokus: '62% 22%',
    video: hundeClip('labrador', [-0.11, -12.86, 97.81, 112.86], 0.95, 0, 4250,
      [-10.86, -2.69, 99.24, 102.69]),   // Ergebnisseite: ruhige Variante A (wedelt, setzt sich, steht auf); B liegt als labrador-lang-b bereit
    eigenschaften: ['kontaktfreudig', 'gutmütig', 'genussfreudig', 'offen', 'unkompliziert', 'begeisterungsfähig'],
    icons: ['koerner', 'telefon', 'hund'],
    ergebnis: { platzhalter: true, tiername: 'Balu', er: 'er',
      charakter: 'Du hast einfach das Herz am richtigen Fleck. Du bist offen, herzlich und mit dir macht das Leben einfach mehr Spaß. Neue Menschen sind für dich Freunde, die du noch nicht kennst. Du nimmst vieles mit Humor und genießt die schönen Dinge. Ein Herz eben!',
      hallo: 'Hey, ich bin {name}! Magst du mich? Ich mag dich nämlich jetzt schon!',
      brief: [
        ['p', 'Weißt du, warum? Weil wir beide ziemlich leicht zu begeistern sind! Ich freu mich über jeden Besuch, jeden Spaziergang und wenn noch ein Leckerli dazukommt, ist der Tag sowieso gerettet!'],
        ['frage', 'Aber weißt du, was noch schöner wäre?'],
        ['wunsch', 'Wenn ich irgendwann meine eigenen Menschen hätte.'],
        ['wende', '{vorname}, du verstehst mich bestimmt. Schließlich weißt du, dass die Dinge am schönsten sind, wenn man sie mit jemandem teilen kann. ❤️'],
        ['p', 'Bis mein großer Wunsch wahr wird, hab ich noch einen kleineren.'],
        ['p', 'Hier in der Arche Noah warten Hunde wie ich auf ein liebevolles Zuhause. Wir brauchen Futter, Pflege, liebevolle Betreuung und einen geschützten Rückzugsort.'],
        ['p', 'Mit deiner monatlichen Spende schenkst du uns einen gemütlichen Platz in einer unserer Hundehütten – zum Ausruhen, Wohlfühlen und Träumen.'],
      ],
      appell: 'Schenk Hunden wie mir einen sicheren Platz, bis wir unsere Familie finden. ❤️',
      button: 'Jetzt monatlich helfen',
      echo: [   // je Frage 1–5 eine Zeile, die die gewählte Antwort aufgreift
        'Du hast gesagt: „Je mehr, desto besser! Wer bringt was zu essen mit?“ Offen, gesellig und genussfreudig: Labrador.',
        'Du hast gesagt: „Ich ruf Verstärkung an und bestell schon mal Pizza.“ Unkompliziert, gesellig und gut organisiert: Labrador.',
        'Du hast gesagt: „Haha, fair. Passiert. Bock auf Kino?“ Gutmütig und gelassen, wie ein Labrador.',
        'Du hast gesagt: „Ich freunde mich mit den Zombies an.“ Offen für alle, sogar für Zombies. Labrador pur.',
        'Du hast gesagt: „Ich schicke gleich deine Lieblingssnacks los.“ Warmherzig, unkompliziert, sofort da: Labrador.',
      ],
      foto: 'bilder/quiz/frage-1.jpg', fokus: '45% 30%', foto2: null } },
]

/** Hund zu einer Kennung aus der Adresse – Standard: Border Collie (wie im Entwurf) */
export const hundNachId = (id: string | null): Hund =>
  HUNDE.find(x => x.id === id) || HUNDE.find(x => x.id === 'collie')!
