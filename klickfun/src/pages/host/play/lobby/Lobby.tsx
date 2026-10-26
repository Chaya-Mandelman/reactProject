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

  if (!isValid) return <p role="alert">מזהה משחק לא תקין</p>
  if (isPending) return <p>טוען משתמשים מחוברים...</p>
  // אין נתונים בכלל = הטעינה הראשונה נכשלה. רענון שנכשל משאיר את הנתונים האחרונים על המסך
  if (!live) return <p role="alert">{getErrorMessage(error)}</p>

  const { status } = live.game
  // משחק שכבר התחיל (או הסתיים) מוצג במסך המשחק
  if (status !== "LOBBY" && status !== "SETUP") return <Navigate to={paths.play(gameId, "game")} replace />

  return (
    <main>
      <h1>{live.game.title} · לובי</h1>
      {error && <p role="alert">{getErrorMessage(error)}</p>}
      <Connected live={live} />
      {/* אפשר להתחיל רק משחק שהלובי שלו פתוח בשרת */}
      {status === "LOBBY"
        ? <LiveStepButton gameId={gameId} action={startGameApi} nextPage="game" label="התחל משחק" />
        : <p>הלובי לא פתוח. <Link to={paths.myGames}>חזרה למשחקים שלי</Link></p>}
    </main>
  )
}

export default Lobby
