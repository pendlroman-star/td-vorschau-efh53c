/* Fortschrittsanzeige „Frage 1 … 5“ */
import { QUIZ } from '../../data/quiz'
import { CheckIcon } from '../ui/icons'

export function QuizSteps({ step }: { step: number }) {
  return (
    <ol className="grid grid-cols-5 gap-[clamp(6px,1.4vw,14px)] m-0 mb-[clamp(22px,3vw,34px)] p-0 list-none" aria-label="Fortschritt">
      {QUIZ.map((_, i) => {
        const done = i < step, current = i === step
        return (
          <li key={i} aria-current={current ? 'step' : undefined} className={`grid gap-2 justify-items-center font-head font-bold text-[.82rem] transition-colors duration-300 ${done || current ? 'text-forest' : 'text-forest/38'}`}>
            <span className="inline-flex items-center gap-1.5 h-[26px]">
              <span aria-hidden="true" className={`${done ? 'grid' : 'hidden'} size-[22px] rounded-full bg-forest text-lime place-items-center`}><CheckIcon className="size-[13px]" /></span>
              <span className={`step__text ${done ? 'hidden' : ''}`} data-short={i + 1} aria-label={`Frage ${i + 1}${done ? ' (beantwortet)' : ''}`}>Frage {i + 1}</span>
            </span>
            <span className={`w-full h-[5px] rounded-full bg-forest/14 overflow-hidden after:content-[''] after:block after:h-full after:bg-forest after:origin-left after:transition-transform after:duration-600 after:ease-smooth ${done || current ? 'after:scale-x-100' : 'after:scale-x-0'}`} />
          </li>
        )
      })}
    </ol>
  )
}
