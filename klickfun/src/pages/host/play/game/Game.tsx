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

  if (!isValid) return <p className="alert mx-4 mt-10 sm:mx-auto sm:max-w-xl" role="alert">מזהה משחק לא תקין</p>
  if (isPending) return <p className="status">טוען משחק...</p>
  // אין נתונים בכלל = הטעינה הראשונה נכשלה. רענון שנכשל משאיר את הנתונים האחרונים על המסך
  if (!live) return <p className="alert mx-4 mt-10 sm:mx-auto sm:max-w-xl" role="alert">{getErrorMessage(error)}</p>

  return (
    <main className="stage-full mx-auto min-h-svh w-full max-w-7xl px-4 pt-14 pb-48 sm:px-6">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="gold-text text-2xl tracking-tight sm:text-3xl">{live.game.title}</h1>
        {(live.phase === "QUESTION" || live.phase === "REVEAL") && (
          <GameControls
            gameId={live.game.id}
            paused={live.paused}
            muted={muted}
            onToggleMute={() => setMuted((prev) => !prev)}
          />
        )}
      </header>
      {error && <p className="alert mb-6" role="alert">{getErrorMessage(error)}</p>}
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
      return <p className="py-20 text-center text-muted">המשחק לא פעיל. <Link className="link" to={paths.myGames}>חזרה למשחקים שלי</Link></p>
  }
}

export default Game
