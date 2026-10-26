import { useMyGames } from "@/hooks/games/useMyGames"
import { getErrorMessage } from "@/utils/getErrorMessage"
import type { GamesFilters } from "@/types/game"
import { GameCard } from "./GameCard"

export function GamesList({ filters }: { filters: GamesFilters }) {
  const { data: games, isLoading, error } = useMyGames(filters)

  if (isLoading) return <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-16 animate-pulse text-center text-lg text-violet-200">טוען משחקים...</div>
  // אין נתונים בכלל = הטעינה הראשונה נכשלה. רענון שנכשל משאיר את הרשימה האחרונה
  if (!games) return <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 rounded-xl border border-rose-400/60 bg-rose-500/15 px-4 py-2 font-semibold text-rose-200" role="alert">{getErrorMessage(error)}</div>

  return (
    <>
      {error && <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 rounded-xl border border-rose-400/60 bg-rose-500/15 px-4 py-2 font-semibold text-rose-200" role="alert">{getErrorMessage(error)}</div>}
      {games.length === 0 ? (
        <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-12 text-center text-lg text-violet-300/80">לא נמצאו משחקים</div>
      ) : (
        <ul className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </ul>
      )}
    </>
  )
}
