import { QUESTION_TYPE_LABELS } from "@/constants/question"
import type { LiveRoundState } from "@/types/liveState"

export function QuestionHeader({ live }: { live: LiveRoundState }) {
  return (
    <header className="relative w-full rounded-[2rem] border-2 border-[#00E5FF]/70 bg-linear-to-b from-[#21104D] via-[#140A38] to-[#08051F] px-5 py-9 shadow-[0_0_0_4px_rgba(168,85,247,0.25),0_0_48px_rgba(0,229,255,0.35),0_30px_80px_-20px_rgba(0,0,0,0.9),inset_0_0_70px_rgba(168,85,247,0.3)] sm:rounded-[2.5rem] sm:px-10 sm:py-14 before:pointer-events-none before:absolute before:inset-x-12 before:top-0 before:h-px before:bg-linear-to-l before:from-transparent before:via-white/70 before:to-transparent">
      <p className="mb-6 inline-block rounded-full px-4 py-1.5 text-xs font-bold tabular-nums ring-1 ring-inset bg-[#F03CFF]/15 text-[#F9A8FF] ring-[#F03CFF]/50 shadow-[0_0_16px_-4px_rgba(240,60,255,0.7)] sm:text-sm">
        שאלה {live.questionNumber} מתוך {live.totalQuestions} · {QUESTION_TYPE_LABELS[live.question.type]}
      </p>
      <h2 className="text-2xl font-extrabold leading-snug text-balance break-words text-white drop-shadow-[0_0_14px_rgba(255,255,255,0.25)] sm:text-4xl lg:text-5xl">{live.question.text}</h2>
    </header>
  )
}
