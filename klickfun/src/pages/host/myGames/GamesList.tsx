import { useMyGames } from "@/hooks/games/useMyGames"
import { getErrorMessage } from "@/utils/getErrorMessage"
import type { GamesFilters } from "@/types/game"
import { GameCard } from "./GameCard"

export function GamesList({ filters }: { filters: GamesFilters }) {
  const { data: games, isLoading, error } = useMyGames(filters)

  if (isLoading) return <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-20 animate-pulse text-center text-[#C9BCEB]">טוען משחקים...</div>
  // אין נתונים בכלל = הטעינה הראשונה נכשלה. רענון שנכשל משאיר את הרשימה האחרונה
  if (!games) return <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 block rounded-2xl border border-rose-400/40 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 shadow-[0_0_24px_-8px_rgba(244,63,94,0.55)] backdrop-blur-md" role="alert">{getErrorMessage(error)}</div>

  return (
    <>
      {error && <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 block rounded-2xl border border-rose-400/40 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 shadow-[0_0_24px_-8px_rgba(244,63,94,0.55)] backdrop-blur-md" role="alert">{getErrorMessage(error)}</div>}
      {games.length === 0 ? (
        <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-16 rounded-3xl border border-dashed border-[#A855F7]/30 bg-[#140A38]/40 py-12 text-center text-[#C9BCEB]/75">לא נמצאו משחקים</div>
      ) : (
        <ul className="mx-auto w-[calc(100%-2rem)] max-w-5xl mt-6 mb-16 text-start grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </ul>
      )}
    </>
  )
}
