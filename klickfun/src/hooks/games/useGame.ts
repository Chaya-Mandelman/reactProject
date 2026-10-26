import { useQuery } from "@tanstack/react-query"
import { getGameApi } from "@/api/games"
import { queryKeys } from "@/api/queryKeys"
import { useUserId } from "@/hooks/auth/useUserId"

export function useGame(id: number, enabled = true) {
  const userId = useUserId()
  return useQuery({
    queryKey: queryKeys.game(userId, id),
    queryFn: () => getGameApi(id),
    enabled,
  })
}
