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
    <div className="mx-auto mb-10 flex w-fit max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-[#A855F7]/25 bg-[#140A38]/80 p-2 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      {paused && <p className="basis-full animate-pulse py-1 text-sm font-bold text-[#FFCA28]" role="status">⏸ המשחק מושהה</p>}
      {paused
        ? <LiveStepButton gameId={gameId} action={resumeGameApi} label="המשך" />
        : <LiveStepButton gameId={gameId} action={pauseGameApi} label="השהיה" />}
      <LiveStepButton gameId={gameId} action={stopGameApi} label="סיום משחק" />
      <button className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-11 px-6 text-sm border border-[#00E5FF]/30 bg-[#140A38]/80 text-[#C9BCEB] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[#00E5FF]/70 hover:bg-[#00E5FF]/10 hover:text-white hover:shadow-[0_0_18px_-4px_rgba(0,229,255,0.6)]" onClick={onToggleMute}>{muted ? "🔇 הפעלת מנגינה" : "🔊 השתקה"}</button>
    </div>
  )
}
