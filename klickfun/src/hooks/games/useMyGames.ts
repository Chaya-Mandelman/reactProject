import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getMyGamesApi } from "@/api/games"
import { queryKeys } from "@/api/queryKeys"
import { useUserId } from "@/hooks/auth/useUserId"
import type { GamesFilters } from "@/types/game"

export function useMyGames(filters: GamesFilters) {
  const userId = useUserId()
  return useQuery({
    queryKey: queryKeys.gamesList(userId, filters),
    queryFn: () => getMyGamesApi(filters),
    // הרשימה הקודמת נשארת על המסך עד שהחדשה מגיעה
    placeholderData: keepPreviousData,
  })
}
