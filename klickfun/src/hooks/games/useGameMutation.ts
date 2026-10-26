import { useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/api/queryKeys"
import { useUserId } from "@/hooks/auth/useUserId"

// mutation שאחרי הצלחה מרענן את רשימת המשחקים ואת המשחק הפתוח
export function useGameMutation<TVariables, TData>(mutationFn: (variables: TVariables) => Promise<TData>) {
  const queryClient = useQueryClient()
  const userId = useUserId()
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.games(userId) }),
  })
}
