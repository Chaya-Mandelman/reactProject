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

  return <p className="grid size-28 place-items-center rounded-full border-4 border-[#FFCA28] bg-radial from-[#21104D] to-[#08051F] px-3 text-lg font-black leading-tight tabular-nums text-[#FFE082] shadow-[0_0_0_6px_rgba(255,202,40,0.12),0_0_34px_rgba(255,202,40,0.55),inset_0_0_22px_rgba(255,202,40,0.3)] sm:size-32 sm:text-xl" role="timer">⏱ {seconds} שניות</p>
}
