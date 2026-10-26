import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addHostApi, updateHostApi } from "@/api/hosts"
import { queryKeys } from "@/api/queryKeys"
import { useUserId } from "@/hooks/auth/useUserId"

// אחרי הצלחה מרעננים את המנחים, וגם את המשחקים כי שם המנחה מופיע בהם
function useHostMutation<TVariables, TData>(mutationFn: (variables: TVariables) => Promise<TData>) {
  const queryClient = useQueryClient()
  const userId = useUserId()
  return useMutation({
    mutationFn,
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.hosts(userId) }),
      queryClient.invalidateQueries({ queryKey: queryKeys.games(userId) }),
    ]),
  })
}

export const useAddHost = () => useHostMutation(addHostApi)
export const useUpdateHost = () => useHostMutation(updateHostApi)
