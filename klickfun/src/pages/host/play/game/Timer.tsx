import { useEffect } from "react"
import { useMelody } from "@/hooks/gameRun/useMelody"
import { toSecondsLeft } from "@/utils/time"
import { sfx } from "@/utils/sfx"
import styles from "./Wow.module.css"

// מ-10 השניות האחרונות המנגינה מואצת
const URGENT_SECONDS = 10
// ב-5 השניות האחרונות: מספר אדום שפועם וטיק בכל שנייה
const FINAL_SECONDS = 5

type Props = {
  ms: number
  paused: boolean
  muted: boolean
}

export function Timer({ ms, paused, muted }: Props) {
  const seconds = toSecondsLeft(ms)
  const final = !paused && seconds > 0 && seconds <= FINAL_SECONDS
  useMelody(!muted && !paused && seconds > 0, seconds <= URGENT_SECONDS)

  useEffect(() => {
    if (final && !muted) sfx.tick(seconds <= 3)
  }, [final, muted, seconds])

  return (
    <p className={`grid size-32 place-content-center xl:size-40 bg-[url(/dial.svg)] bg-contain bg-center bg-no-repeat text-center tabular-nums drop-shadow-[0_0_22px_rgb(31_139_255/0.5)] ${final ? styles.urgentDial : ""}`} role="timer">
      {/* key: המספר נבנה מחדש בכל שנייה, כדי שהפעימה תרוץ שוב */}
      <span key={final ? seconds : "calm"} className={`text-4xl leading-none font-black text-white ${final ? styles.urgentNumber : ""}`}>{seconds}</span>
      <span className="mt-1 text-xs font-semibold text-muted">שניות</span>
    </p>
  )
}
