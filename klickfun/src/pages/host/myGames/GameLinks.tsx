import { Link } from "react-router"
import type { GameStatus } from "../../../types/game"
import { LiveStepButton } from "../../../components/LiveStepButton"
import { openLobyApi } from "../../../api/gameRun"

// משחק בסטטוסים האלה כבר פתוח בשרת — רק עוברים ללובי
const OPEN_STATUSES: GameStatus[] = ["LOBBY", "RUNNING", "PAUSED"]

export function GameLinks({ gameId, status }: { gameId: number, status: GameStatus }) {
  const lobbyPath = `/play/${gameId}/lobby`

  // כפתור הפתיחה פותח לובי בשרת (הסטטוס הופך ל-LOBBY) ורק אז עובר לדף הלובי
  return (
    <nav>
      {OPEN_STATUSES.includes(status)
        ? <Link to={lobbyPath}>חזרה ללובי</Link>
        : <LiveStepButton gameId={gameId} funcApi={openLobyApi} namePage="lobby" label="התחלת משחק" />}
      <Link to={`/games/edit/${gameId}`}>עריכת המשחק</Link>
    </nav>
  )
}
