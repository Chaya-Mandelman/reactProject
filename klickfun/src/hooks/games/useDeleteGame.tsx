import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteGameApi, duplicateGameApi } from "../../api/games/gamesApi"


export function useDeleteGame() {
    const queryClient = useQueryClient()
    const deleteGame = useMutation({
        mutationFn: (id: number) => deleteGameApi(id),
        onSuccess: () => {
            // רשימת "המשחקים שלי" תיטען מחדש לאחר מחיקת המשחק
            queryClient.invalidateQueries({ queryKey: ["games"] })
        },

    })
    return deleteGame
}

export function useDuplicateGame() {
    const queryClient = useQueryClient()
    const duplicateGame = useMutation({
        mutationFn: (id: number) => duplicateGameApi(id),
        onSuccess: () => {
            // רשימת "המשחקים שלי" תיטען מחדש לאחר שכפול המשחק
            queryClient.invalidateQueries({ queryKey: ["games"] })
        }
    })
    return duplicateGame
}