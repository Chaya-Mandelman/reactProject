import { QUESTION_TYPE_LABELS } from "@/constants/question"
import type { LiveRoundState } from "@/types/liveState"

export function QuestionHeader({ live }: { live: LiveRoundState }) {
  return (
    <header className="w-full rounded-[2rem] border-2 border-cyan-300/80 bg-indigo-950/80 px-6 py-10 text-center shadow-[0_0_35px_rgba(34,211,238,0.5),inset_0_0_40px_rgba(168,85,247,0.35)]">
      <p className="mb-4 inline-block rounded-full border border-fuchsia-400/60 bg-fuchsia-500/15 px-4 py-1 text-sm font-semibold text-fuchsia-200">
        שאלה {live.questionNumber} מתוך {live.totalQuestions} · {QUESTION_TYPE_LABELS[live.question.type]}
      </p>
      <h2 className="text-3xl font-extrabold leading-snug text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.35)] md:text-5xl">{live.question.text}</h2>
    </header>
  )
}
