import { QUESTION_TYPE_LABELS } from "@/constants/question"
import type { LiveRoundState } from "@/types/liveState"

export function QuestionHeader({ live }: { live: LiveRoundState }) {
  return (
    <header>
      <p>
        שאלה {live.questionNumber} מתוך {live.totalQuestions} · {QUESTION_TYPE_LABELS[live.question.type]}
      </p>
      <h2>{live.question.text}</h2>
    </header>
  )
}
