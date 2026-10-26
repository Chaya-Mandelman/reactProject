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
    <nav className="order-2 mt-4 grid w-full grid-cols-2 gap-2">
      {isActiveStatus(status)
        ? <Link className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-11 px-6 text-sm bg-linear-to-b from-[#FFE082] to-[#FFCA28] text-[#08051F] shadow-[0_4px_0_0_#b8860b,0_10px_28px_-6px_rgba(255,202,40,0.7)] ring-1 ring-inset ring-white/50 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_6px_0_0_#b8860b,0_14px_34px_-4px_rgba(255,202,40,0.9)] active:translate-y-0.5 active:shadow-[0_1px_0_0_#b8860b,0_6px_18px_-6px_rgba(255,202,40,0.7)]" to={paths.play(gameId, status === "LOBBY" ? "lobby" : "game")}>חזרה למשחק</Link>
        : <LiveStepButton gameId={gameId} action={openLobbyApi} nextPage="lobby" label="התחלת משחק" />}
      <Link className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-11 px-6 text-sm border border-[#00E5FF]/30 bg-[#140A38]/80 text-[#C9BCEB] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[#00E5FF]/70 hover:bg-[#00E5FF]/10 hover:text-white hover:shadow-[0_0_18px_-4px_rgba(0,229,255,0.6)]" to={paths.editGame(gameId)}>עריכת המשחק</Link>
    </nav>
  )
}
