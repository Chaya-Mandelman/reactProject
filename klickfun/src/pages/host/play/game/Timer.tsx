import { useMelody } from "@/hooks/gameRun/useMelody"
import { toSecondsLeft } from "@/utils/time"

// מ-10 השניות האחרונות המנגינה מואצת
const URGENT_SECONDS = 10

type Props = {
  ms: number
  paused: boolean
  muted: boolean
}

export function Timer({ ms, paused, muted }: Props) {
  const seconds = toSecondsLeft(ms)
  useMelody(!muted && !paused && seconds > 0, seconds <= URGENT_SECONDS)

  return <p role="timer">⏱ {seconds} שניות</p>
}
