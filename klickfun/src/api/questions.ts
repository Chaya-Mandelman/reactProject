import { api } from "./apiClient"
import type { GameItemRef } from "@/types/game"
import type { ImageChange, Question, QuestionInput } from "@/types/question"

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

// התמונה נשלחת כקובץ עצמו (לא JSON). השרת בודק את הסוג לפי התוכן
export const setQuestionImageApi = async ({ gameId, id, blob }: GameItemRef & { blob: Blob }): Promise<string> => {
  const response = await api.put<{ imageId: string }>(`/games/${gameId}/questions/${id}/image`, blob, {
    headers: { "Content-Type": blob.type || "application/octet-stream" },
  })
  return response.data.imageId
}

export const deleteQuestionImageApi = async ({ gameId, id }: GameItemRef): Promise<void> => {
  await api.delete(`/games/${gameId}/questions/${id}/image`)
}

export const applyImageChange = async (ref: GameItemRef, image: ImageChange): Promise<void> => {
  if (image.kind === "set") await setQuestionImageApi({ ...ref, blob: image.blob })
  if (image.kind === "remove") await deleteQuestionImageApi(ref)
}

// כתובת ציבורית של תמונה (תגית img לא שולחת Token)
export const imageUrl = (imageId: string) => `${import.meta.env.VITE_API_URL}/media/${imageId}`
