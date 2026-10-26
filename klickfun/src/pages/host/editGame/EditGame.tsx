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

  if (!isValid) return <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 block rounded-2xl border border-rose-400/40 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 shadow-[0_0_24px_-8px_rgba(244,63,94,0.55)] backdrop-blur-md" role="alert">מזהה משחק לא תקין</div>
  if (isLoading) return <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-20 animate-pulse text-center text-[#C9BCEB]">טוען משחק...</div>
  // אין נתונים בכלל = הטעינה הראשונה נכשלה. רענון שנכשל משאיר את הטופס על המסך
  if (!game) return <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 block rounded-2xl border border-rose-400/40 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 shadow-[0_0_24px_-8px_rgba(244,63,94,0.55)] backdrop-blur-md" role="alert">{getErrorMessage(error)}</div>

  // משחק פעיל נעול: השרת מחזיר 409 על כל עריכה
  const locked = isActiveStatus(game.status)

  return (
    <>
      <Link className="mx-auto w-[calc(100%-2rem)] max-w-5xl mt-8 flex items-center gap-2 text-sm font-semibold text-[#00E5FF] transition duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)] before:content-['→']" to={paths.myGames}>חזרה למשחקים שלי</Link>
      <h1 className="mx-auto w-[calc(100%-2rem)] max-w-5xl mt-12 mb-10 text-center text-4xl font-black tracking-tight md:text-5xl bg-linear-to-b from-[#FFF3C4] via-[#FFCA28] to-[#F5A300] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(255,202,40,0.45)] after:mx-auto after:mt-4 after:block after:h-1 after:w-20 after:rounded-full after:bg-linear-to-l after:from-[#F03CFF] after:via-[#00E5FF] after:to-[#FFCA28] after:shadow-[0_0_12px_rgba(0,229,255,0.7)] mt-6">עריכת משחק</h1>
      {error && <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 block rounded-2xl border border-rose-400/40 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 shadow-[0_0_24px_-8px_rgba(244,63,94,0.55)] backdrop-blur-md" role="alert">{getErrorMessage(error)}</div>}
      {locked && <p className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 block rounded-2xl border border-[#FFCA28]/40 bg-[#FFCA28]/10 px-5 py-3 text-sm font-semibold text-[#FFE082] shadow-[0_0_24px_-8px_rgba(255,202,40,0.55)] backdrop-blur-md" role="alert">המשחק פעיל כרגע, ולכן אי אפשר לערוך אותו</p>}
      <GameDetailsForm game={game} locked={locked} />
      <Participants game={game} locked={locked} />
      <Questions game={game} locked={locked} />
    </>
  )
}

function GameDetailsForm({ game, locked }: { game: GameDetails; locked: boolean }) {
  const updateGame = useUpdateGame()

  return (
    <section className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-6 block rounded-3xl border border-[#A855F7]/30 bg-linear-to-b from-[#21104D]/90 to-[#140A38]/90 p-5 sm:p-6 text-start shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9),0_0_40px_-22px_rgba(168,85,247,0.7)] ring-1 ring-inset ring-white/5 backdrop-blur-xl">
      <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white before:h-6 before:w-1.5 before:rounded-full before:bg-linear-to-b before:from-[#F03CFF] before:to-[#00E5FF] before:shadow-[0_0_10px_rgba(240,60,255,0.7)]">פרטי משחק</h2>
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
