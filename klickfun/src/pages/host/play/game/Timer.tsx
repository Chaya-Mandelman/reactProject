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

  return (
    <p className="grid size-32 place-content-center xl:size-40 bg-[url(/dial.svg)] bg-contain bg-center bg-no-repeat text-center tabular-nums drop-shadow-[0_0_22px_rgb(31_139_255/0.5)]" role="timer">
      <span className="text-4xl leading-none font-black text-white">{seconds}</span>
      <span className="mt-1 text-xs font-semibold text-muted">שניות</span>
    </p>
  )
}
