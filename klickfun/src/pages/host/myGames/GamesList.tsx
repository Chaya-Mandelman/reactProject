import { useMyGames } from "../../../hooks/games/useMyGames"
import { getErrorMessage } from "../../../utils/getErrorMessage"
import type { GamesFilters } from "../../../types/game"
import { GameCard } from "./GameCard"

export function GamesList({ filters }: { filters: GamesFilters }) {
  const { data: games = [], isLoading, error } = useMyGames(filters)

  if (isLoading) return <div>טוען משחקים...</div>
  if (error) return <div role="alert">{getErrorMessage(error)}</div>
  if (games.length === 0) return <div>לא נמצאו משחקים</div>

  return (
    <ul>
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </ul>
  )
}
