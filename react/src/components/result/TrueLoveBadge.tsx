import type { Ref } from 'react'
import './trueLove.css'

export function TrueLoveBadge({ ref }: { ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className="true-love" role="img" aria-label="Schenke Hunden einen sicheren Platz">
      <svg className="true-love__ring" viewBox="0 0 120 120"><defs><path id="tl" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0" /></defs><text textLength="280" lengthAdjust="spacing"><textPath href="#tl" textLength="280" lengthAdjust="spacing">SCHENKE HUNDEN EINEN SICHEREN PLATZ ♥</textPath></text></svg>
      <svg className="true-love__heart" viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" /><path d="M24.2 36c-5-3.4-11.4-8.2-12.9-13.5-1.2-4.1 1.2-8.4 5.1-8.9 3.2-.4 6.2 1.8 7.6 4.9 1.4-3.4 4.4-5.6 7.8-5.1 4.1.7 6.1 5.2 4.6 9.3-1.8 5.1-7.7 9.8-12.3 13.3" /></svg>
    </div>
  )
}
