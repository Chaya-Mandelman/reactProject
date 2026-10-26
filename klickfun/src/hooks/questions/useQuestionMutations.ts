import { addQuestionApi, deleteQuestionApi, updateQuestionApi } from "@/api/questions"
import { useGameMutation } from "@/hooks/games/useGameMutation"

export const useAddQuestion = () => useGameMutation(addQuestionApi)
export const useUpdateQuestion = () => useGameMutation(updateQuestionApi)
export const useDeleteQuestion = () => useGameMutation(deleteQuestionApi)
