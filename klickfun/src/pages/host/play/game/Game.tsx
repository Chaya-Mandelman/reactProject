import { useState } from "react"
import { Link, Navigate } from "react-router"
import { paths } from "@/constants/routes"
import { useLive } from "@/hooks/gameRun/useLive"
import { useGameId } from "@/hooks/useGameId"
import type { LiveState } from "@/types/liveState"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { GameControls } from "./GameControls"
import { QuestionView } from "./QuestionView"
import { RevealView } from "./RevealView"
import { SummaryView } from "./SummaryView"

// מסך משחק אחד: השרת מקדם את המשחק לבד, והמסך מציג את מה שמתאים ל-phase
function Game() {
  const { gameId, isValid } = useGameId()
  const { data: live, isPending, error } = useLive(gameId, isValid)
  // ההשתקה כאן ולא בטיימר, כדי שתישמר בין השאלות
  const [muted, setMuted] = useState(false)

  if (!isValid) return <p className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 rounded-xl border border-rose-400/60 bg-rose-500/15 px-4 py-2 font-semibold text-rose-200" role="alert">מזהה משחק לא תקין</p>
  if (isPending) return <p className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-16 animate-pulse text-center text-lg text-violet-200">טוען משחק...</p>
  // אין נתונים בכלל = הטעינה הראשונה נכשלה. רענון שנכשל משאיר את הנתונים האחרונים על המסך
  if (!live) return <p className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 rounded-xl border border-rose-400/60 bg-rose-500/15 px-4 py-2 font-semibold text-rose-200" role="alert">{getErrorMessage(error)}</p>

  return (
    <main className="mx-auto w-[calc(100%-2rem)] max-w-6xl py-8 text-center">
      <h1 className="mb-8 text-center text-3xl font-black md:text-5xl bg-linear-to-b from-amber-100 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(251,191,36,0.55)]">{live.game.title}</h1>
      {error && <p className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 rounded-xl border border-rose-400/60 bg-rose-500/15 px-4 py-2 font-semibold text-rose-200" role="alert">{getErrorMessage(error)}</p>}
      {(live.phase === "QUESTION" || live.phase === "REVEAL") && (
        <GameControls
          gameId={live.game.id}
          paused={live.paused}
          muted={muted}
          onToggleMute={() => setMuted((prev) => !prev)}
        />
      )}
      <GameStage live={live} muted={muted} />
    </main>
  )
}

function GameStage({ live, muted }: { live: LiveState; muted: boolean }) {
  switch (live.phase) {
    case "QUESTION":
      return <QuestionView live={live} muted={muted} />
    case "REVEAL":
      return <RevealView live={live} />
    case "FINISHED":
      return <SummaryView live={live} />
    case "LOBBY":
      return <Navigate to={paths.play(live.game.id, "lobby")} replace />
    default:
      return <p className="text-center text-violet-200">המשחק לא פעיל. <Link className="font-bold text-cyan-300 underline-offset-4 hover:underline" to={paths.myGames}>חזרה למשחקים שלי</Link></p>
  }
}

export default Game
