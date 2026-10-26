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

  if (!isValid) return <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 rounded-xl border border-rose-400/60 bg-rose-500/15 px-4 py-2 font-semibold text-rose-200" role="alert">מזהה משחק לא תקין</div>
  if (isLoading) return <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-16 animate-pulse text-center text-lg text-violet-200">טוען משחק...</div>
  // אין נתונים בכלל = הטעינה הראשונה נכשלה. רענון שנכשל משאיר את הטופס על המסך
  if (!game) return <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 rounded-xl border border-rose-400/60 bg-rose-500/15 px-4 py-2 font-semibold text-rose-200" role="alert">{getErrorMessage(error)}</div>

  // משחק פעיל נעול: השרת מחזיר 409 על כל עריכה
  const locked = isActiveStatus(game.status)

  return (
    <>
      <Link className="mx-auto w-[calc(100%-2rem)] max-w-5xl mt-6 block font-bold text-cyan-300 underline-offset-4 hover:underline" to={paths.myGames}>חזרה למשחקים שלי</Link>
      <h1 className="mx-auto w-[calc(100%-2rem)] max-w-5xl mt-10 mb-8 text-center text-4xl font-black tracking-tight md:text-5xl bg-linear-to-b from-amber-100 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(251,191,36,0.55)]">עריכת משחק</h1>
      {error && <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 rounded-xl border border-rose-400/60 bg-rose-500/15 px-4 py-2 font-semibold text-rose-200" role="alert">{getErrorMessage(error)}</div>}
      {locked && <p className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 rounded-xl border border-rose-400/60 bg-rose-500/15 px-4 py-2 font-semibold text-rose-200" role="alert">המשחק פעיל כרגע, ולכן אי אפשר לערוך אותו</p>}
      <GameDetailsForm game={game} locked={locked} />
      <Participants game={game} locked={locked} />
      <Questions game={game} locked={locked} />
    </>
  )
}

function GameDetailsForm({ game, locked }: { game: GameDetails; locked: boolean }) {
  const updateGame = useUpdateGame()

  return (
    <section className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-8">
      <h2 className="mx-auto w-[calc(100%-2rem)] max-w-5xl mb-5 text-2xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]">פרטי משחק</h2>
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
