import { useMutation, useQueryClient } from "@tanstack/react-query"

// mutation שאחרי הצלחה מרענן את רשימת המשחקים ואת המשחק הפתוח
export function useGameMutation<T, R>(mutationFn: (variables: T) => Promise<R>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["games"] }),
  })
}
