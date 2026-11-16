/* „Dein Match ist erst der Anfang“ – zweites Foto und Ausblick auf die E-Mails */
import type { Ergebnis, Hund } from '../../data/hunde'
import { ButtonLink } from '../ui/Button'
import { Wrap } from '../ui/Wrap'

interface Props { h: Hund; e: Ergebnis; sein: string; ihn: string; onDauer: () => void }

const P = 'm-0 mb-4 max-w-[62ch]'

export function MatchSection({ h, e, sein, ihn, onDauer }: Props) {
  return (
    <section className="pt-[clamp(56px,8vw,104px)] pb-[clamp(56px,8vw,96px)] bg-white" aria-labelledby="m-title">
      <Wrap className="grid grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] tablet:grid-cols-1 gap-[clamp(24px,5vw,64px)] items-start">
        <figure className="m-0 rounded-2xl overflow-hidden aspect-[4/3.4] bg-lime-100 shadow-sm" id="m-figure" data-in>
          {e.foto2
            ? <img className="w-full h-full object-cover" src={e.foto2} style={{ objectPosition: e.fokus2 || '50% 50%' }} alt={`Noch ein Bild von ${e.tiername}`} loading="lazy" />
            : <img className="w-full h-full object-contain object-[50%_100%] pt-[6%]" src={h.bild} alt={`Noch ein Bild von ${e.tiername}`} loading="lazy" />}
        </figure>
        <div data-in>
          <h2 id="m-title" className="m-0 mb-[.7rem] font-head font-extrabold text-[clamp(1.6rem,3vw,2.3rem)] uppercase leading-[1.1]">Dein Match ist erst der Anfang</h2>
          <p className={`${P} font-bold`}>Du hast deinen tierischen Doppelgänger gefunden – jetzt wird es spannend. 🐾</p>
          <p className={P}>{`In den nächsten Tagen nehmen wir dich mit auf eine kleine Reise und erzählen dir mehr über ${e.tiername}, deinen Doppelgänger: ${sein} Geschichte, ${sein} Persönlichkeit und was ${ihn} so besonders macht. Außerdem erfährst du mehr über unsere Arbeit und darüber, wie du mit deiner Entscheidung echten Tierschutz unterstützen kannst.`}</p>
          <p className={`${P} font-bold`}>Also: Augen offen halten und immer wieder in dein Postfach schauen.<br />{`Wir freuen uns, dich und ${e.tiername} noch ein Stück näher zusammenzubringen. `}<span aria-hidden="true">❤️</span></p>
          <div className="flex flex-wrap gap-2.5 mt-[1.6rem]">
            <ButtonLink variante="red" href="#spenden" onClick={onDauer} id="m-donate">{e.button}</ButtonLink>
          </div>
        </div>
      </Wrap>
    </section>
  )
}
