import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { LiveState } from "../../types/liveState"

// mutation של הרצת משחק: שומר את ה-live שחזר ומרענן את המשחקים (הסטטוס השתנה)
export function useLiveMutation(mutationFn: (id: number) => Promise<LiveState>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: (live, id) => {
      queryClient.setQueryData(["live", id], live)
      queryClient.invalidateQueries({ queryKey: ["gameLive"] })
    },
  })
}
