import { useQuery } from "@tanstack/react-query"
import { getMyGames } from "../../api/games/gamesApi"
import { type GamesFilters} from "../../types/game"


export function useMyGames(filters: GamesFilters) {
  return useQuery({
    queryKey: ["games", filters],
    queryFn: () => getMyGames(filters),
  })
}