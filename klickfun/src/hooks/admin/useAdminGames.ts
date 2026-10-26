import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getAdminGamesApi } from "@/api/gameAdminApi"
import { queryKeys } from "@/api/queryKeys"
import { useUserId } from "@/hooks/auth/useUserId"
import type { GamesAdminFilters } from "@/types/gamesAdminFilter"

export function useAdminGames(filters: GamesAdminFilters) {
  const userId = useUserId()
  return useQuery({
    queryKey: queryKeys.adminGamesList(userId, filters),
    queryFn: () => getAdminGamesApi(filters),
    placeholderData: keepPreviousData,
  })
}
