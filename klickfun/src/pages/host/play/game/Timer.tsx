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

  return <p className="flex size-32 items-center justify-center rounded-full border-4 border-amber-300 bg-indigo-950/80 text-center text-xl font-black leading-tight text-amber-200 shadow-[0_0_30px_rgba(251,191,36,0.55)]" role="timer">⏱ {seconds} שניות</p>
}
