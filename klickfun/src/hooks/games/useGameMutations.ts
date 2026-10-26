import { addGameApi, deleteGameApi, duplicateGameApi, updateGameApi } from "../../api/games"
import { useGameMutation } from "./useGameMutation"

export const useAddGame = () => useGameMutation(addGameApi)
export const useUpdateGame = () => useGameMutation(updateGameApi)
export const useDuplicateGame = () => useGameMutation(duplicateGameApi)
export const useDeleteGame = () => useGameMutation(deleteGameApi)
