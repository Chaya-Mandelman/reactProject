import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addGameApi } from "../../api/games/gamesApi"

export function useAddGame() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addGameApi,
    onSuccess: () => {
      // רשימת "המשחקים שלי" תיטען מחדש עם המשחק החדש
      queryClient.invalidateQueries({ queryKey: ["games"] })
    },
  })
}