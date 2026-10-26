import { pauseGameApi, resumeGameApi, stopGameApi } from "@/api/gameRun"
import { LiveStepButton } from "@/components/LiveStepButton"

type Props = {
  gameId: number
  paused: boolean
  muted: boolean
  onToggleMute: () => void
}

// שליטה במשחק רץ: השהיה או המשך לפי המצב, סיום שמעביר את המסך לסיכום, והשתקת המנגינה
export function GameControls({ gameId, paused, muted, onToggleMute }: Props) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
      {paused && <p className="w-full animate-pulse text-center text-xl font-bold text-amber-300" role="status">⏸ המשחק מושהה</p>}
      {paused
        ? <LiveStepButton gameId={gameId} action={resumeGameApi} label="המשך" />
        : <LiveStepButton gameId={gameId} action={pauseGameApi} label="השהיה" />}
      <LiveStepButton gameId={gameId} action={stopGameApi} label="סיום משחק" />
      <button className="cursor-pointer rounded-full font-bold transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100 border-2 border-cyan-400/70 bg-cyan-400/5 px-5 py-2 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.35)] hover:bg-cyan-400/15 hover:shadow-[0_0_22px_rgba(34,211,238,0.6)]" onClick={onToggleMute}>{muted ? "🔇 הפעלת מנגינה" : "🔊 השתקה"}</button>
    </div>
  )
}
