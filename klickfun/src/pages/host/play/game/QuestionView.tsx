import type { LiveQuestionState } from "@/types/liveState"
import { AnswerPopups } from "./AnswerPopups"
import { FastestList } from "./FastestList"
import { OptionsList } from "./OptionsList"
import { QuestionHeader } from "./QuestionHeader"
import { Timer } from "./Timer"
import styles from "./QuestionView.module.css"

type Props = {
  live: LiveQuestionState
  muted: boolean
}

export function QuestionView({ live, muted }: Props) {
  return (
    <div className={styles.layout}>
      <section>
        <QuestionHeader live={live} />
        <Timer ms={live.timeLeftMs} paused={live.paused} muted={muted} />
        <OptionsList options={live.question.options} />
        <p>ענו {live.answeredCount} מתוך {live.connectedCount} מחוברים</p>
        <AnswerPopups answers={live.recentAnswers} />
      </section>
      <FastestList fastest={live.fastest} />
    </div>
  )
}
