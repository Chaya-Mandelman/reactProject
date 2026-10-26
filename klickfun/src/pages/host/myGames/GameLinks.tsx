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
    <nav className="mt-3 flex flex-wrap items-center gap-3">
      {isActiveStatus(status)
        ? <Link className="cursor-pointer rounded-full font-bold transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100 border-2 border-amber-200 bg-linear-to-b from-amber-300 to-amber-500 px-7 py-3 text-lg font-black text-indigo-950 shadow-[0_0_28px_rgba(251,191,36,0.6)] hover:scale-105 hover:shadow-[0_0_40px_rgba(251,191,36,0.9)]" to={paths.play(gameId, status === "LOBBY" ? "lobby" : "game")}>חזרה למשחק</Link>
        : <LiveStepButton gameId={gameId} action={openLobbyApi} nextPage="lobby" label="התחלת משחק" />}
      <Link className="cursor-pointer rounded-full font-bold transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100 border-2 border-cyan-400/70 bg-cyan-400/5 px-5 py-2 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.35)] hover:bg-cyan-400/15 hover:shadow-[0_0_22px_rgba(34,211,238,0.6)]" to={paths.editGame(gameId)}>עריכת המשחק</Link>
    </nav>
  )
}
