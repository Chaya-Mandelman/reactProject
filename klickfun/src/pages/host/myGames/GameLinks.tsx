import { Link, useNavigate } from "react-router"
import type { GameStatus } from "../../../types/game"
import { useOpenLobby } from "../../../hooks/gameRun/useGameRunMutations"
import { getErrorMessage } from "../../../utils/getErrorMessage"

// משחק בסטטוסים האלה כבר פתוח בשרת — רק עוברים ללובי
const OPEN_STATUSES: GameStatus[] = ["LOBBY", "RUNNING", "PAUSED"]

export function GameLinks({ gameId, status }: { gameId: number, status: GameStatus }) {
  const navigate = useNavigate()
  const openLobby = useOpenLobby()
  const lobbyPath = `/play/${gameId}/lobby`

  // פותחים לובי בשרת (הסטטוס הופך ל-LOBBY) ורק אז עוברים לדף הלובי
  const handleStart = () => {
    openLobby.mutate(gameId, { onSuccess: () => navigate(lobbyPath) })
  }

  return (
    <nav>
      {OPEN_STATUSES.includes(status)
        ? <Link to={lobbyPath}>חזרה ללובי</Link>
        : <button onClick={handleStart} disabled={openLobby.isPending}>
            {openLobby.isPending ? "פותח לובי..." : "התחלת משחק"}
          </button>}
      <Link to={`/games/edit/${gameId}`}>עריכת המשחק</Link>
      {openLobby.isError && <p>{getErrorMessage(openLobby.error)}</p>}
    </nav>
  )
}
