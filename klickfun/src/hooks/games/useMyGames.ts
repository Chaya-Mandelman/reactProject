import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getMyGamesApi } from "../../api/games"
import type { GamesFilters } from "../../types/game"

export function useMyGames(filters: GamesFilters) {
  return useQuery({
    queryKey: ["games", filters],
    queryFn: () => getMyGamesApi(filters),
    // הרשימה הקודמת נשארת על המסך עד שהחדשה מגיעה
    placeholderData: keepPreviousData,
  })
}
