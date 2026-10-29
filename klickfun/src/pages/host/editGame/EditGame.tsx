import { GameForm } from "@/components/GameForm"
import { PageNav } from "@/components/PageNav"
import { isActiveStatus } from "@/constants/game"
import { getLivePath, paths } from "@/constants/routes"
import { useGame } from "@/hooks/games/useGame"
import { useUpdateGame } from "@/hooks/games/useGameMutations"
import { useGameId } from "@/hooks/useGameId"
import type { GameDetails } from "@/types/game"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { Participants } from "./Participants"
import { Questions } from "./Questions"

function EditGame() {
  const { gameId, isValid } = useGameId()
  const { data: game, isLoading, error } = useGame(gameId, isValid)

  if (!isValid) return <div className="alert mt-10" role="alert">מזהה משחק לא תקין</div>
  if (isLoading) return <div className="status">טוען משחק...</div>
  // אין נתונים בכלל = הטעינה הראשונה נכשלה. רענון שנכשל משאיר את הטופס על המסך
  if (!game) return <div className="alert mt-10" role="alert">{getErrorMessage(error)}</div>

  // משחק פעיל נעול: השרת מחזיר 409 על כל עריכה
  const locked = isActiveStatus(game.status)

  return (
    <>
      <PageNav
        back={{ to: paths.myGames, label: "חזרה למשחקים שלי" }}
        forward={locked ? { to: getLivePath(game.id, game.status), label: "חזרה למשחק הפעיל" } : undefined}
      />
      <h1 className="page-title mt-4">עריכת משחק</h1>
      {error && <div className="alert mb-6" role="alert">{getErrorMessage(error)}</div>}
      {locked && <p className="alert-warn mb-6" role="alert">המשחק פעיל כרגע, ולכן אי אפשר לערוך אותו</p>}
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <GameDetailsForm game={game} locked={locked} />
        <Participants game={game} locked={locked} />
      </div>
      <Questions game={game} locked={locked} />
    </>
  )
}

function GameDetailsForm({ game, locked }: { game: GameDetails; locked: boolean }) {
  const updateGame = useUpdateGame()

  return (
    <section className="card">
      <h2 className="section-title">פרטי משחק</h2>
      <GameForm
        defaultValues={{ title: game.title, description: game.description ?? "" }}
        submitLabel="שמירה"
        disabled={locked}
        onSubmit={(details) => updateGame.mutateAsync({ id: game.id, details })}
      />
    </section>
  )
}

export default EditGame
