import { api } from "./apiClient"
import type { GameItemRef } from "@/types/game"
import type { Question, QuestionInput } from "@/types/question"

export const addQuestionApi = async ({ gameId, details }: { gameId: number; details: QuestionInput }): Promise<Question> => {
  const response = await api.post<{ question: Question }>(`/games/${gameId}/questions`, details)
  return response.data.question
}

export const updateQuestionApi = async ({ gameId, id, details }: GameItemRef & { details: QuestionInput }): Promise<Question> => {
  const response = await api.patch<{ question: Question }>(`/games/${gameId}/questions/${id}`, details)
  return response.data.question
}

export const deleteQuestionApi = async ({ gameId, id }: GameItemRef): Promise<void> => {
  await api.delete(`/games/${gameId}/questions/${id}`)
}
