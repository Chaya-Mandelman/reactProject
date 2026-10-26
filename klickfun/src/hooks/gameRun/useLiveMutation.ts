import { useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/api/queryKeys"
import { useUserId } from "@/hooks/auth/useUserId"
import type { LiveState } from "@/types/liveState"

export type LiveAction = (id: number) => Promise<LiveState>

// mutation של הרצת משחק: שומר את ה-live שחזר ומרענן את המשחקים (הסטטוס השתנה)
export function useLiveMutation(mutationFn: LiveAction) {
  const queryClient = useQueryClient()
  const userId = useUserId()
  return useMutation({
    mutationFn,
    onSuccess: (live, id) => {
      queryClient.setQueryData(queryKeys.live(userId, id), live)
      queryClient.invalidateQueries({ queryKey: queryKeys.games(userId) })
    },
  })
}
