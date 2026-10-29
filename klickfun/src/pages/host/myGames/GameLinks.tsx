import { Link } from "react-router"
import { openLobbyApi } from "@/api/gameRun"
import { LiveStepButton } from "@/components/LiveStepButton"
import { isActiveStatus } from "@/constants/game"
import { getLivePath, paths } from "@/constants/routes"
import type { GameStatus } from "@/types/game"

type Props = {
  gameId: number
  status: GameStatus
}

export function GameLinks({ gameId, status }: Props) {
  // משחק פעיל כבר פתוח בשרת, אז רק חוזרים אליו (ללובי או למסך המשחק).
  // אחרת הכפתור פותח לובי בשרת (הסטטוס הופך ל-LOBBY) ורק אז עובר לדף הלובי
  return (
    <nav className="mt-auto grid w-full grid-cols-2 gap-2">
      {isActiveStatus(status)
        ? <Link className="btn btn-gold" to={getLivePath(gameId, status)}>חזרה למשחק</Link>
        : <LiveStepButton gameId={gameId} action={openLobbyApi} to={paths.play(gameId, "lobby")} label="התחלת משחק" />}
      <Link className="btn btn-ghost" to={paths.editGame(gameId)}>עריכת המשחק</Link>
    </nav>
  )
}
