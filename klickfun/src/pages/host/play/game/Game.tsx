import { useState } from "react"
import { Navigate } from "react-router"
import { PageNav } from "@/components/PageNav"
import { paths } from "@/constants/routes"
import { useLive } from "@/hooks/gameRun/useLive"
import { useGameId } from "@/hooks/useGameId"
import type { LeaderboardRow, LiveState } from "@/types/liveState"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { GameControls } from "./GameControls"
import { QuestionView } from "./QuestionView"
import { RevealView } from "./RevealView"
import { SummaryView } from "./SummaryView"

// מסך משחק אחד: השרת מקדם את המשחק לבד, והמסך מציג את מה שמתאים ל-phase
function Game() {
  const { gameId, isValid } = useGameId()
  const { data: live, isPending, error } = useLive(gameId, isValid)
  // ההשתקה כאן ולא בטיימר, כדי שתישמר בין השאלות
  const [muted, setMuted] = useState(false)
  // טבלת הניקוד של החשיפה האחרונה, והטבלה שלפניה: כדי להראות מי עלתה ומי ירדה
  const [boards, setBoards] = useState<{ questionId: number; board: LeaderboardRow[]; previous?: LeaderboardRow[] } | null>(null)

  if (!isValid) return <p className="alert mx-4 mt-10 sm:mx-auto sm:max-w-xl" role="alert">מזהה משחק לא תקין</p>
  if (isPending) return <p className="status">טוען משחק...</p>
  // אין נתונים בכלל = הטעינה הראשונה נכשלה. רענון שנכשל משאיר את הנתונים האחרונים על המסך
  if (!live) return <p className="alert mx-4 mt-10 sm:mx-auto sm:max-w-xl" role="alert">{getErrorMessage(error)}</p>

  // חשיפה של שאלה חדשה: הטבלה הנוכחית הופכת ל"קודמת" (עדכון בזמן הרינדור, לפי התבנית של React)
  if (live.phase === "REVEAL" && boards?.questionId !== live.question.id) {
    setBoards({ questionId: live.question.id, board: live.reveal.leaderboard, previous: boards?.board })
  }
  const previousBoard = live.phase === "REVEAL" && boards?.questionId === live.question.id ? boards.previous : undefined

  return (
    <main className="stage-full mx-auto min-h-svh w-full max-w-7xl px-4 pb-48 sm:px-6">
      {/* יציאה מהמסך לא עוצרת את המשחק בשרת: חוזרים אליו מכרטיס המשחק */}
      <PageNav back={{ to: paths.myGames, label: "חזרה לכל המשחקים" }} />
      <header className="mt-6 mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="gold-text text-2xl tracking-tight sm:text-3xl">{live.game.title}</h1>
        {(live.phase === "QUESTION" || live.phase === "REVEAL") && (
          <GameControls
            gameId={live.game.id}
            paused={live.paused}
            canSkip={live.phase === "QUESTION"}
            muted={muted}
            onToggleMute={() => setMuted((prev) => !prev)}
          />
        )}
      </header>
      {error && <p className="alert mb-6" role="alert">{getErrorMessage(error)}</p>}
      <GameStage live={live} muted={muted} previousBoard={previousBoard} />
    </main>
  )
}

function GameStage({ live, muted, previousBoard }: { live: LiveState; muted: boolean; previousBoard?: LeaderboardRow[] }) {
  switch (live.phase) {
    case "QUESTION":
      return <QuestionView live={live} muted={muted} />
    case "REVEAL":
      // key: כל שאלה מקבלת רגע מתח משלה
      return <RevealView key={live.question.id} live={live} muted={muted} previous={previousBoard} />
    case "FINISHED":
      return <SummaryView live={live} muted={muted} />
    case "LOBBY":
      return <Navigate to={paths.play(live.game.id, "lobby")} replace />
    default:
      return <p className="py-20 text-center text-muted">המשחק לא פעיל</p>
  }
}

export default Game
