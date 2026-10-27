import type { LiveQuestionState } from "@/types/liveState"
import { AnswerPopups } from "./AnswerPopups"
import { FastestList } from "./FastestList"
import { OptionsList } from "./OptionsList"
import { QuestionHeader } from "./QuestionHeader"
import { Timer } from "./Timer"

type Props = {
  live: LiveQuestionState
  muted: boolean
}

// הטיימר בפאנל אחד, השאלה במרכז, והמהירים בפאנל השני
export function QuestionView({ live, muted }: Props) {
  return (
    <div className="grid items-start gap-8 xl:grid-cols-[14rem_1fr_14rem]">
      <aside className="card flex flex-wrap items-center justify-center gap-5 px-5 py-6 xl:flex-col xl:py-7">
        <Timer ms={live.timeLeftMs} paused={live.paused} muted={muted} />
        <p className="chip chip-cyan px-4 py-1.5 text-sm tabular-nums">ענו {live.answeredCount} מתוך {live.connectedCount} מחוברים</p>
      </aside>
      <section className="flex flex-col items-center gap-10 pt-4">
        <QuestionHeader live={live} />
        <OptionsList options={live.question.options} />
        <AnswerPopups answers={live.recentAnswers} />
      </section>
      <FastestList fastest={live.fastest} />
    </div>
  )
}
