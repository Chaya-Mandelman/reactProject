import { Link } from "react-router"
import { openLobbyApi } from "@/api/gameRun"
import { LiveStepButton } from "@/components/LiveStepButton"
import { isActiveStatus } from "@/constants/game"
import { paths } from "@/constants/routes"
import type { GameStatus } from "@/types/game"

type Props = {
  gameId: number
  status: GameStatus
}

export function GameLinks({ gameId, status }: Props) {
  // משחק פעיל כבר פתוח בשרת, אז רק חוזרים אליו (ללובי או למסך המשחק).
  // אחרת הכפתור פותח לובי בשרת (הסטטוס הופך ל-LOBBY) ורק אז עובר לדף הלובי
  return (
    <nav>
      {isActiveStatus(status)
        ? <Link to={paths.play(gameId, status === "LOBBY" ? "lobby" : "game")}>חזרה למשחק</Link>
        : <LiveStepButton gameId={gameId} action={openLobbyApi} nextPage="lobby" label="התחלת משחק" />}
      <Link to={paths.editGame(gameId)}>עריכת המשחק</Link>
    </nav>
  )
}
