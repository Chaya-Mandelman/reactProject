import { QUESTION_TYPE_LABELS } from "@/constants/question"
import type { LiveRoundState } from "@/types/liveState"

export function QuestionHeader({ live }: { live: LiveRoundState }) {
  return (
    <header className="frame-hex relative w-full px-16 pt-12 pb-10 text-center [border-image-width:58px]">
      <p className="chip chip-gold absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 text-sm whitespace-nowrap tabular-nums shadow-[0_0_16px_-2px_rgb(247_201_72/0.6)]">
        שאלה {live.questionNumber} מתוך {live.totalQuestions} · {QUESTION_TYPE_LABELS[live.question.type]}
      </p>
      <h2 className="text-2xl leading-snug font-black text-balance break-words text-white drop-shadow-[0_2px_10px_rgb(0_0_0/0.8)] sm:text-4xl lg:text-5xl">{live.question.text}</h2>
    </header>
  )
}
