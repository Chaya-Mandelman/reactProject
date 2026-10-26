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
    <div>
      {paused && <p role="status">⏸ המשחק מושהה</p>}
      {paused
        ? <LiveStepButton gameId={gameId} action={resumeGameApi} label="המשך" />
        : <LiveStepButton gameId={gameId} action={pauseGameApi} label="השהיה" />}
      <LiveStepButton gameId={gameId} action={stopGameApi} label="סיום משחק" />
      <button onClick={onToggleMute}>{muted ? "🔇 הפעלת מנגינה" : "🔊 השתקה"}</button>
    </div>
  )
}
