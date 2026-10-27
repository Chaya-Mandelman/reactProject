import { nextQuestionApi } from "@/api/gameRun"
import { LiveStepButton } from "@/components/LiveStepButton"
import type { LiveRevealState } from "@/types/liveState"
import { Distribution } from "./Distribution"
import { Leaderboard } from "./Leaderboard"
import { OptionsList } from "./OptionsList"
import { QuestionHeader } from "./QuestionHeader"

// בתחרותית: התשובה הנכונה וטבלת הניקוד. בסקר: התפלגות התשובות.
// החשיפה נשארת על המסך עד שהמנחה עוברת לשאלה הבאה
export function RevealView({ live }: { live: LiveRevealState }) {
  const { question, reveal } = live
  const isPoll = question.type === "POLL"

  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center gap-10 pt-4">
      <QuestionHeader live={live} />
      {isPoll
        ? <Distribution options={question.options} counts={reveal.distribution} />
        : <OptionsList options={question.options} correctOption={reveal.correctOption} />}
      <div className="cta">
        <LiveStepButton gameId={live.game.id} action={nextQuestionApi} label={live.isLastQuestion ? "לסיכום" : "לשאלה הבאה"} />
      </div>
      {!isPoll && <Leaderboard rows={reveal.leaderboard} />}
    </section>
  )
}
