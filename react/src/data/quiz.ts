import type { HundId } from './hunde'

/* ------------------------------------------------------------------
   QUIZ – Kundenfassung vom 11.11.2026 („ATA LC Quiz Text_final")
   Fünf Fragen, je sechs Antworten. Jede Antwort gehört genau einer Rasse
   und zählt einen Punkt. Die Rasse mit den meisten Punkten gewinnt;
   bei Gleichstand entscheidet die Antwort in Frage 5, sonst Frage 4, 3 …
   Die Reihenfolge der Antworten wird bei jedem Durchlauf neu gemischt.
   ------------------------------------------------------------------ */
export interface QuizFrage {
  frage: string
  bild: string
  fokus: string
  antworten: Record<HundId, string>
}

export const QUIZ: QuizFrage[] = [
  { frage: 'Gruppenchat, 17:42 Uhr: „Hat heute Abend jemand Lust auf irgendwas?“ Dein erster Gedanke:', bild: 'bilder/quiz/frage-1.jpg', fokus: '50% 30%',
    antworten: {
      schaeferhund: '„Ich überlege und frag erst mal: Wer fährt? Und wer bringt alle sicher heim?“',
      jack:         '„Ich war schon ready, als die Nachricht ankam. Wohin es geht, erfahre ich unterwegs.“',
      dackel:       '„Heute nicht. Ich hab’s mir gerade gemütlich gemacht.“',
      havaneser:    '„Hauptsache, alle sind dabei und keiner bleibt außen vor.“',
      collie:       '„Ich hab schon drei Vorschläge recherchiert. Mit Öffnungszeiten.“',
      labrador:     '„Gibt’s was zu essen/trinken?“',
    } },
  { frage: 'Im Karton: ein Regal. 143 Schrauben. Eine Anleitung. Was machst du?', bild: 'bilder/quiz/frage-2.jpg', fokus: '60% 40%',
    antworten: {
      schaeferhund: '„Ich fang an und hör erst auf, wenn es steht.“',
      jack:         '„Akkuschrauber her und Musik aufdrehen, das wird schon!“',
      dackel:       '„Ich bau das Ding auf meine Art. Wenn zwei Schrauben übrig bleiben, nenne ich das Design.“',
      havaneser:    '„Ich setz mich dazu und sorge für gute Stimmung. Hauptsache kein Streit.“',
      collie:       '„Ich lese erst ausführlich die Anleitung. Mindestens zweimal.“',
      labrador:     '„Ich ruf Verstärkung an. Besonders freu ich mich aber auf die Pizza.“',
    } },
  { frage: 'Jemand sagt dir ins Gesicht: „Da hast du dich jetzt im Ton vergriffen!“ Wie reagierst du?', bild: 'bilder/quiz/frage-3.jpg', fokus: '50% 45%',
    antworten: {
      schaeferhund: '„Stimmt vermutlich. Ich bring’s in Ordnung.“',
      jack:         '„Moooment! Das lass ich so nicht stehen!“',
      dackel:       '„Interessante Meinung. Ich seh das trotzdem anders und erklär dir eindrücklich, wieso.“',
      havaneser:    '„Autsch. Das beschäftigt mich jetzt noch drei Tage.“',
      collie:       '„Wie genau? Ich will’s verstehen und beim nächsten Mal besser machen.“',
      labrador:     '„Haha, fair. Passiert. Bock auf Kino?“',
    } },
  { frage: 'Zombie-Alarm! Die Welt, wie wir sie kennen, ist vorbei. Was machst du?', bild: 'bilder/quiz/frage-4.jpg', fokus: '35% 50%',
    antworten: {
      schaeferhund: '„Ich organisiere die Gruppe. Keiner wird zurückgelassen.“',
      jack:         '„Ich renne laut schreiend auf die Zombies zu. Irgendwer muss ja anfangen.“',
      dackel:       '„Ich schleiche mich unauffällig davon und such mir ein cleveres Versteck.“',
      havaneser:    '„Hauptsache, meine Lieblingsmenschen sind bei mir.“',
      collie:       '„Ich hab einen Plan, einen Plan B, zwei längst gepackte Überlebenskits und einen Plan C.“',
      labrador:     '„Ich freunde mich mit den Zombies an und wir gehen was trinken.“',
    } },
  { frage: 'Mitten in der Nacht schreibt dein Lieblingsmensch: „Ich steck in der Patsche.“ Du so?', bild: 'bilder/quiz/frage-5.jpg', fokus: '40% 60%',
    antworten: {
      schaeferhund: '„Schick mir deinen Standort, ich kümmere mich drum.“',
      jack:         '„Keine Ahnung was los ist, aber ich spring ins Auto und bin unterwegs, egal wie wild es wird.“',
      dackel:       '„Ich seh die Nachricht erst morgen früh. Dann steh ich mit Kaffee und einer klaren Meinung vor deiner Tür.“',
      havaneser:    '„Ich ruf sofort an und bleib dran, bis du ruhiger bist. Wir reden, bis du zuhause bist.“',
      collie:       '„Ich hör zu, sortiere die Lage und hab in fünf Minuten eine saubere Lösung parat.“',
      labrador:     '„Ich schicke ein Taxi zu dir mit deinen Lieblingssnacks. Für die innere Balance.“',
    } },
]
