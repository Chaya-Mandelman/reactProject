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
      <section className="flex flex-col items-center gap-8">
        <QuestionHeader live={live} />
        <Timer ms={live.timeLeftMs} paused={live.paused} muted={muted} />
        <OptionsList options={live.question.options} />
        <p className="rounded-full border border-[#00E5FF]/30 bg-[#140A38]/80 px-5 py-2 text-sm font-semibold tabular-nums text-[#C9BCEB] shadow-[0_0_18px_-6px_rgba(0,229,255,0.6)] backdrop-blur-md">ענו {live.answeredCount} מתוך {live.connectedCount} מחוברים</p>
        <AnswerPopups answers={live.recentAnswers} />
      </section>
      <FastestList fastest={live.fastest} />
    </div>
  )
}
