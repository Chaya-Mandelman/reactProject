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

  if (!isValid) return <p className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 rounded-xl border border-rose-400/60 bg-rose-500/15 px-4 py-2 font-semibold text-rose-200" role="alert">מזהה משחק לא תקין</p>
  if (isPending) return <p className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-16 animate-pulse text-center text-lg text-violet-200">טוען משתמשים מחוברים...</p>
  // אין נתונים בכלל = הטעינה הראשונה נכשלה. רענון שנכשל משאיר את הנתונים האחרונים על המסך
  if (!live) return <p className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 rounded-xl border border-rose-400/60 bg-rose-500/15 px-4 py-2 font-semibold text-rose-200" role="alert">{getErrorMessage(error)}</p>

  const { status } = live.game
  // משחק שכבר התחיל (או הסתיים) מוצג במסך המשחק
  if (status !== "LOBBY" && status !== "SETUP") return <Navigate to={paths.play(gameId, "game")} replace />

  return (
    <main className="mx-auto w-[calc(100%-2rem)] max-w-6xl py-8 text-center">
      <h1 className="mb-8 text-center text-3xl font-black md:text-5xl bg-linear-to-b from-amber-100 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(251,191,36,0.55)]">{live.game.title} · לובי</h1>
      {error && <p className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 rounded-xl border border-rose-400/60 bg-rose-500/15 px-4 py-2 font-semibold text-rose-200" role="alert">{getErrorMessage(error)}</p>}
      <Connected live={live} />
      {/* אפשר להתחיל רק משחק שהלובי שלו פתוח בשרת */}
      {status === "LOBBY"
        ? <LiveStepButton gameId={gameId} action={startGameApi} nextPage="game" label="התחל משחק" />
        : <p className="text-center text-violet-200">הלובי לא פתוח. <Link className="font-bold text-cyan-300 underline-offset-4 hover:underline" to={paths.myGames}>חזרה למשחקים שלי</Link></p>}
    </main>
  )
}

export default Lobby
