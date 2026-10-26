import { useMyGames } from "@/hooks/games/useMyGames"
import { getErrorMessage } from "@/utils/getErrorMessage"
import type { GamesFilters } from "@/types/game"
import { GameCard } from "./GameCard"

export function GamesList({ filters }: { filters: GamesFilters }) {
  const { data: games, isLoading, error } = useMyGames(filters)

  if (isLoading) return <div>טוען משחקים...</div>
  // אין נתונים בכלל = הטעינה הראשונה נכשלה. רענון שנכשל משאיר את הרשימה האחרונה
  if (!games) return <div role="alert">{getErrorMessage(error)}</div>

  return (
    <>
      {error && <div role="alert">{getErrorMessage(error)}</div>}
      {games.length === 0 ? (
        <div>לא נמצאו משחקים</div>
      ) : (
        <ul>
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </ul>
      )}
    </>
  )
}
