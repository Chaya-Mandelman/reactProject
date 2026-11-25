import { nextQuestionApi } from "@/api/gameRun"
import { LiveStepButton } from "@/components/LiveStepButton"
import { QuestionImage } from "@/components/QuestionImage"
import { useSuspense } from "@/hooks/gameRun/useSuspense"
import type { LeaderboardRow, LiveRevealState } from "@/types/liveState"
import { sfx } from "@/utils/sfx"
import { Distribution } from "./Distribution"
import { Leaderboard } from "./Leaderboard"
import { OptionsList } from "./OptionsList"
import { QuestionHeader } from "./QuestionHeader"
import styles from "./Wow.module.css"

// כמה זמן נמשך רגע המתח לפני החשיפה
const SUSPENSE_MS = 2200

type Props = {
  live: LiveRevealState
  muted: boolean
  // טבלת הניקוד אחרי השאלה הקודמת: ממנה מחשבים מי עלתה ומי ירדה
  previous?: LeaderboardRow[]
}

// בתחרותית: התשובה הנכונה וטבלת הניקוד. בסקר: התפלגות התשובות.
// קודם רגע מתח עם תיפוף, ואז חשיפה עם הבזק. החשיפה נשארת עד שהמנחה עוברת לשאלה הבאה
export function RevealView({ live, muted, previous }: Props) {
  const { question, reveal } = live
  const isPoll = question.type === "POLL"
  const revealed = useSuspense(
    SUSPENSE_MS,
    () => !muted && sfx.drumroll(SUSPENSE_MS),
    () => !muted && sfx.ding(),
  )

  const everyoneAnswered = live.connectedCount > 0 && live.answeredCount >= live.connectedCount
  const leader = reveal.leaderboard[0]
  const newLeader = !isPoll && previous && previous.length > 0 && leader && leader.score > 0 && previous[0]?.participantId !== leader.participantId

  if (!revealed) {
    return (
      <div className={styles.suspense} role="status" aria-live="assertive">
        <p className={styles.suspenseSub}>{everyoneAnswered ? "🎉 כולן ענו!" : "⏰ הזמן נגמר!"}</p>
        <p className={`${styles.suspenseTitle} ${styles.dots}`}>{isPoll ? "ומה בחרתם" : "והתשובה הנכונה היא"}</p>
      </div>
    )
  }

  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center gap-10 pt-4">
      <div className={styles.flash} aria-hidden="true" />
      <QuestionHeader live={live} />
      <QuestionImage imageId={question.imageId} className="max-h-[25vh]" />
      {isPoll
        ? <Distribution options={question.options} counts={reveal.distribution} />
        : <OptionsList options={question.options} correctOption={reveal.correctOption} celebrate />}
      <div className="cta">
        <LiveStepButton gameId={live.game.id} action={nextQuestionApi} label={live.isLastQuestion ? "לסיכום" : "לשאלה הבאה"} />
      </div>
      {newLeader && <p className={styles.leaderBanner} role="status">👑 מובילה חדשה: {leader.name}!</p>}
      {!isPoll && <Leaderboard rows={reveal.leaderboard} previous={previous} animateFromMs={600} />}
    </section>
  )
}
