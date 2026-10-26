import { Link } from "react-router"
import { GameForm } from "@/components/GameForm"
import { isActiveStatus } from "@/constants/game"
import { paths } from "@/constants/routes"
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

  if (!isValid) return <div role="alert">מזהה משחק לא תקין</div>
  if (isLoading) return <div>טוען משחק...</div>
  // אין נתונים בכלל = הטעינה הראשונה נכשלה. רענון שנכשל משאיר את הטופס על המסך
  if (!game) return <div role="alert">{getErrorMessage(error)}</div>

  // משחק פעיל נעול: השרת מחזיר 409 על כל עריכה
  const locked = isActiveStatus(game.status)

  return (
    <>
      <Link to={paths.myGames}>חזרה למשחקים שלי</Link>
      <h1>עריכת משחק</h1>
      {error && <div role="alert">{getErrorMessage(error)}</div>}
      {locked && <p role="alert">המשחק פעיל כרגע, ולכן אי אפשר לערוך אותו</p>}
      <GameDetailsForm game={game} locked={locked} />
      <Participants game={game} locked={locked} />
      <Questions game={game} locked={locked} />
    </>
  )
}

function GameDetailsForm({ game, locked }: { game: GameDetails; locked: boolean }) {
  const updateGame = useUpdateGame()

  return (
    <section>
      <h2>פרטי משחק</h2>
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
