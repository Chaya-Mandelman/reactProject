import type { LiveRevealState } from "@/types/liveState"
import { toSecondsLeft } from "@/utils/time"
import { Distribution } from "./Distribution"
import { Leaderboard } from "./Leaderboard"
import { OptionsList } from "./OptionsList"
import { QuestionHeader } from "./QuestionHeader"

// בתחרותית: התשובה הנכונה וטבלת הניקוד. בסקר: התפלגות התשובות
export function RevealView({ live }: { live: LiveRevealState }) {
  const { question, reveal } = live

  return (
    <section className="flex flex-col items-center gap-6">
      <QuestionHeader live={live} />
      {question.type === "POLL" ? (
        <Distribution options={question.options} counts={reveal.distribution} />
      ) : (
        <>
          <OptionsList options={question.options} correctOption={reveal.correctOption} />
          <Leaderboard rows={reveal.leaderboard} />
        </>
      )}
      {live.revealLeftMs !== null && (
        <p className="animate-pulse text-lg font-semibold text-cyan-200">
          {live.isLastQuestion ? "הסיכום" : "השאלה הבאה"} בעוד {toSecondsLeft(live.revealLeftMs)} שניות
        </p>
      )}
    </section>
  )
}
