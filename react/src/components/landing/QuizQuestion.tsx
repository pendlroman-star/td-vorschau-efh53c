/* Eine Quizfrage mit sechs Antworten (Reihenfolge je Durchlauf gemischt) und Bild */
import type { MouseEvent } from 'react'
import type { HundId } from '../../data/hunde'
import { QUIZ } from '../../data/quiz'
import { Button } from '../ui/Button'
import { CheckIcon } from '../ui/icons'
import './quiz.css'

interface Props {
  i: number
  reihenfolge: HundId[]
  gewaehlt: HundId | undefined
  onAntwort: (id: HundId, e: MouseEvent<HTMLButtonElement>) => void
  onZurueck: (e: MouseEvent<HTMLButtonElement>) => void
}

export function QuizQuestion({ i, reihenfolge, gewaehlt, onAntwort, onZurueck }: Props) {
  const q = QUIZ[i]
  return (
    <div className="q">
      <div className="[grid-area:head]">
        <p className="m-0 mb-[.3rem] font-head font-bold text-[.95rem]">Frage {i + 1} von {QUIZ.length}</p>
        <h3 className="m-0 mb-[1.3rem] max-w-[34em] font-head font-extrabold text-[clamp(1.3rem,2.3vw,1.7rem)] leading-[1.2] outline-none text-balance" id="qTitle" tabIndex={-1}>{q.frage}</h3>
      </div>
      <ul className="[grid-area:answers] grid gap-2.5 m-0 p-0 list-none" role="list" aria-labelledby="qTitle">
        {reihenfolge.map(id => {
          const an = gewaehlt === id
          return (
            <li key={id}>
              <button
                type="button"
                data-k={id}
                aria-pressed={an}
                onClick={e => onAntwort(id, e)}
                className={`answer relative flex items-center gap-3.5 w-full min-h-14 py-[.7em] px-[1em] border-[1.5px] border-solid rounded-[14px] font-medium text-base text-left leading-[1.35] cursor-pointer [transition:background-color_200ms,translate_300ms_var(--ease-smooth),box-shadow_300ms_var(--ease-smooth)] motion-reduce:transition-none hover:translate-x-1 hover:shadow-sm ${an ? 'bg-lime border-lime-600' : 'bg-white border-forest/35 hover:bg-lime-100 hover:border-forest'}`}
              >
                <span aria-hidden="true" className={`flex-none grid place-items-center size-[26px] border-2 border-solid border-forest/55 rounded-full transition-colors duration-200 ${an ? 'bg-forest' : 'bg-white'}`}>
                  <CheckIcon strokeWidth="3.4" className={`size-3.5 text-lime [transition:opacity_200ms,scale_400ms_var(--ease-spring)] ${an ? 'opacity-100 scale-100' : 'opacity-0 scale-40'}`} />
                </span>
                <span>{q.antworten[id]}</span>
              </button>
            </li>
          )
        })}
      </ul>
      <figure className="group [grid-area:media] self-stretch relative m-0 min-h-[220px] rounded-[14px] overflow-hidden bg-lime-100 tablet:aspect-[5/2] tablet:min-h-0 tablet:mb-4">
        <img src={q.bild} alt="" style={{ objectPosition: q.fokus }} decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[6s] ease-linear group-hover:scale-[1.04]" />
      </figure>
      <Button variante="outline" groesse="sm" className="[grid-area:back] justify-self-start mt-[22px]" onClick={onZurueck}>Zurück</Button>
    </div>
  )
}
