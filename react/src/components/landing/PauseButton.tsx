/* Anhalten/Abspielen des Sliders – muss sichtbar bleiben (WCAG 2.2.2). Aussehen: heroSlider.css (.still-btn) */
export function PauseButton({ still, onToggle }: { still: boolean; onToggle: () => void }) {
  const text = still ? 'Bewegung fortsetzen' : 'Bewegung anhalten'
  return (
    <button type="button" className="still-btn" id="stillBtn" aria-controls="dogs" aria-label={text} title={text} onClick={onToggle}>
      <svg className="i-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.5" /><rect x="14" y="5" width="4" height="14" rx="1.5" /></svg>
      <svg className="i-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.6v12.8c0 .8.9 1.3 1.6.9l10-6.4c.6-.4.6-1.4 0-1.8l-10-6.4C8.9 4.3 8 4.8 8 5.6z" /></svg>
    </button>
  )
}
