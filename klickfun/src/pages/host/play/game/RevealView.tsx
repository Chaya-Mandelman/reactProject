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
    <section className="mx-auto flex max-w-5xl flex-col items-center gap-10 pt-4">
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
        <p className="chip chip-cyan px-5 py-2 text-sm tabular-nums">
          {live.isLastQuestion ? "הסיכום" : "השאלה הבאה"} בעוד {toSecondsLeft(live.revealLeftMs)} שניות
        </p>
      )}
    </section>
  )
}
