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
    <div className="flex flex-wrap items-center gap-2 [&_.btn]:h-9 [&_.btn]:px-4 [&_.btn]:text-xs [&_.btn-gold]:shadow-[inset_0_1px_0_rgb(255_255_255/0.6),0_2px_0_#b8860b]">
      {paused && <p className="chip animate-pulse bg-gold/10 text-gold ring-gold/30 motion-reduce:animate-none" role="status">⏸ המשחק מושהה</p>}
      {paused
        ? <LiveStepButton gameId={gameId} action={resumeGameApi} label="המשך" />
        : <LiveStepButton gameId={gameId} action={pauseGameApi} label="השהיה" />}
      <LiveStepButton gameId={gameId} action={stopGameApi} label="סיום משחק" />
      <button className="btn btn-ghost" onClick={onToggleMute}>{muted ? "🔇 הפעלת מנגינה" : "🔊 השתקה"}</button>
    </div>
  )
}
