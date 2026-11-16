/* Umgebung: Live-Seite, Bewegung reduzieren, Geräteansicht */

/** Echte Seite der Arche Noah? (Spendenformular als iframe, keine Test-Werkzeuge) */
export const LIVE_HOST = /(^|\.)aktivertierschutz\.at$/
export const istLiveSeite = (): boolean => LIVE_HOST.test(location.hostname)

/** Test-Werkzeuge (Testmenü, Geräteansicht) nur abseits der Live-Seite – VOR DEM LIVEGANG ENTFERNEN */
export const istTestSeite = (): boolean => !istLiveSeite()

/** Läuft die Seite in einem iframe (z. B. in der Geräteansicht)? */
export const imIframe = (): boolean => window.top !== window

export const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)')
/** „Bewegung reduzieren“ im System eingestellt? (wird jedes Mal neu abgefragt) */
export const reduce = (): boolean => reduceMQ.matches
