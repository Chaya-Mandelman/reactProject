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

  if (!isValid) return <p role="alert">מזהה משחק לא תקין</p>
  if (isPending) return <p>טוען משחק...</p>
  // אין נתונים בכלל = הטעינה הראשונה נכשלה. רענון שנכשל משאיר את הנתונים האחרונים על המסך
  if (!live) return <p role="alert">{getErrorMessage(error)}</p>

  return (
    <main>
      <h1>{live.game.title}</h1>
      {error && <p role="alert">{getErrorMessage(error)}</p>}
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
      return <p>המשחק לא פעיל. <Link to={paths.myGames}>חזרה למשחקים שלי</Link></p>
  }
}

export default Game
