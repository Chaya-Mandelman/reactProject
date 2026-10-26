import { useAnswerPopups } from "@/hooks/gameRun/useAnswerPopups"
import type { RecentAnswer } from "@/types/liveState"
import styles from "./AnswerPopups.module.css"

// כל מי שעונה קופץ למסך לשנייה. בסוף האנימציה השם יורד מהרשימה
export function AnswerPopups({ answers }: { answers: RecentAnswer[] }) {
  const { popups, remove } = useAnswerPopups(answers)

  return (
    <ul className={styles.popups} aria-live="polite">
      {popups.map((answer) => (
        <li key={answer.answerId} className={styles.popup} onAnimationEnd={() => remove(answer.answerId)}>
          {answer.name}
        </li>
      ))}
    </ul>
  )
}
