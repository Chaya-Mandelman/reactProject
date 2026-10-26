import { api } from "./apiClient"
import type { Question, QuestionInput } from "../types/question"

type ItemRef = { gameId: number, id: number }

export const addQuestionApi = async ({ gameId, details }: { gameId: number, details: QuestionInput }): Promise<Question> => {
  const response = await api.post<{ question: Question }>(`/games/${gameId}/questions`, details)
  return response.data.question
}

export const updateQuestionApi = async ({ gameId, id, details }: ItemRef & { details: QuestionInput }): Promise<Question> => {
  const response = await api.patch<{ question: Question }>(`/games/${gameId}/questions/${id}`, details)
  return response.data.question
}

export const deleteQuestionApi = async ({ gameId, id }: ItemRef): Promise<void> => {
  await api.delete(`/games/${gameId}/questions/${id}`)
}
