import { Link, Navigate } from "react-router"
import { startGameApi } from "@/api/gameRun"
import { LiveStepButton } from "@/components/LiveStepButton"
import { paths } from "@/constants/routes"
import { useLive } from "@/hooks/gameRun/useLive"
import { useGameId } from "@/hooks/useGameId"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { Connected } from "./Connected"

function Lobby() {
  const { gameId, isValid } = useGameId()
  const { data: live, isPending, error } = useLive(gameId, isValid)

  if (!isValid) return <p className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 block rounded-2xl border border-rose-400/40 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 shadow-[0_0_24px_-8px_rgba(244,63,94,0.55)] backdrop-blur-md" role="alert">מזהה משחק לא תקין</p>
  if (isPending) return <p className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-20 animate-pulse text-center text-[#C9BCEB]">טוען משתמשים מחוברים...</p>
  // אין נתונים בכלל = הטעינה הראשונה נכשלה. רענון שנכשל משאיר את הנתונים האחרונים על המסך
  if (!live) return <p className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 block rounded-2xl border border-rose-400/40 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 shadow-[0_0_24px_-8px_rgba(244,63,94,0.55)] backdrop-blur-md" role="alert">{getErrorMessage(error)}</p>

  const { status } = live.game
  // משחק שכבר התחיל (או הסתיים) מוצג במסך המשחק
  if (status !== "LOBBY" && status !== "SETUP") return <Navigate to={paths.play(gameId, "game")} replace />

  return (
    <main className="mx-auto w-[calc(100%-2rem)] max-w-6xl py-10 text-center">
      <h1 className="mb-8 text-3xl font-black tracking-tight md:text-4xl bg-linear-to-b from-[#FFF3C4] via-[#FFCA28] to-[#F5A300] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(255,202,40,0.45)]">{live.game.title} · לובי</h1>
      {error && <p className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 block rounded-2xl border border-rose-400/40 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 shadow-[0_0_24px_-8px_rgba(244,63,94,0.55)] backdrop-blur-md" role="alert">{getErrorMessage(error)}</p>}
      <Connected live={live} />
      {/* אפשר להתחיל רק משחק שהלובי שלו פתוח בשרת */}
      {status === "LOBBY"
        ? <LiveStepButton gameId={gameId} action={startGameApi} nextPage="game" label="התחל משחק" />
        : <p className="text-[#C9BCEB]">הלובי לא פתוח. <Link className="font-semibold text-[#00E5FF] transition duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" to={paths.myGames}>חזרה למשחקים שלי</Link></p>}
    </main>
  )
}

export default Lobby
