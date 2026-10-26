import { Link, useParams } from "react-router"
import { useGame } from "../../../hooks/games/useGame"
import { useUpdateGame } from "../../../hooks/games/useGameMutations"
import { getErrorMessage } from "../../../utils/getErrorMessage"
import type { GameDetails, GameStatus } from "../../../types/game"
import { GameForm } from "../../../components/GameForm"
import { Participants } from "./Participants"
import { Questions } from "./Questions"

// במצבים האלה השרת מחזיר 409 על כל עריכה
const LOCKED_STATUSES: GameStatus[] = ["LOBBY", "RUNNING", "PAUSED"]

function EditGame() {
  const gameId = Number(useParams().gameId)
  const { data: game, isLoading, error } = useGame(gameId)

  if (isLoading) return <div>טוען משחק...</div>
  if (!game) return <div role="alert">{getErrorMessage(error)}</div>

  const locked = LOCKED_STATUSES.includes(game.status)

  return (
    <>
      <Link to="/games">חזרה למשחקים שלי</Link>
      <h1>עריכת משחק</h1>
      {locked && <p role="alert">המשחק פעיל כרגע, ולכן אי אפשר לערוך אותו</p>}
      <GameDetailsForm game={game} locked={locked} />
      <Participants game={game} locked={locked} />
      <Questions game={game} locked={locked} />
    </>
  )
}

function GameDetailsForm({ game, locked }: { game: GameDetails; locked: boolean }) {
  const edit = useUpdateGame()

  return (
    <section>
      <h2>פרטי משחק</h2>
      <GameForm
        defaultValues={{ title: game.title, description: game.description ?? "" }}
        submitLabel="שמירה"
        disabled={locked}
        onSubmit={(details) => edit.mutateAsync({ id: game.id, details })}
      />
    </section>
  )
}

export default EditGame
