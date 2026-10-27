import { Link, Navigate } from "react-router"
import { startGameApi } from "@/api/gameRun"
import { LiveStepButton } from "@/components/LiveStepButton"
import { paths } from "@/constants/routes"
import { useLive } from "@/hooks/gameRun/useLive"
import { useGameId } from "@/hooks/useGameId"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { Connected } from "./Connected"

// המספר שהמשתתפים מחייגים אליו כדי להצטרף למשחק
const DIAL_IN_PHONE = "077-2271841"

function Lobby() {
  const { gameId, isValid } = useGameId()
  const { data: live, isPending, error } = useLive(gameId, isValid)

  if (!isValid) return <p className="alert mx-4 mt-10 sm:mx-auto sm:max-w-xl" role="alert">מזהה משחק לא תקין</p>
  if (isPending) return <p className="status">טוען משתמשים מחוברים...</p>
  // אין נתונים בכלל = הטעינה הראשונה נכשלה. רענון שנכשל משאיר את הנתונים האחרונים על המסך
  if (!live) return <p className="alert mx-4 mt-10 sm:mx-auto sm:max-w-xl" role="alert">{getErrorMessage(error)}</p>

  const { status } = live.game
  // משחק שכבר התחיל (או הסתיים) מוצג במסך המשחק
  if (status !== "LOBBY" && status !== "SETUP") return <Navigate to={paths.play(gameId, "game")} replace />

  return (
    <main className="stage-full mx-auto flex min-h-svh w-full max-w-5xl flex-col items-center px-4 pt-14 pb-48 text-center sm:px-6">
      <h1 className="gold-text text-4xl tracking-tight break-words sm:text-6xl">{live.game.title} · לובי</h1>
      <div className="chip chip-gold mt-6 gap-3 px-6 py-2.5 text-lg">
        מספר להתחברות: <span className="text-2xl font-black tracking-wide text-white tabular-nums" dir="ltr">{DIAL_IN_PHONE}</span>
      </div>
      {error && <p className="alert mt-6 w-full" role="alert">{getErrorMessage(error)}</p>}
      <Connected live={live} />
      {/* אפשר להתחיל רק משחק שהלובי שלו פתוח בשרת */}
      <div className="cta mt-2">
        {status === "LOBBY"
          ? <LiveStepButton gameId={gameId} action={startGameApi} nextPage="game" label="התחל משחק" />
          : <p className="text-muted">הלובי לא פתוח. <Link className="link" to={paths.myGames}>חזרה למשחקים שלי</Link></p>}
      </div>
    </main>
  )
}

export default Lobby
