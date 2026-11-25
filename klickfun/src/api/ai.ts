import { api } from "./apiClient"
import type { QuestionInput } from "@/types/question"

export type AiDifficulty = "EASY" | "MEDIUM" | "HARD"
export type AiQuestionKind = "COMPETITIVE" | "POLL" | "MIXED"

export interface GenerateQuestionsRequest {
  topic: string
  count: number
  difficulty: AiDifficulty
  kind: AiQuestionKind
  notes?: string
}

export interface GenerateQuestionsResult {
  questions: QuestionInput[]
  // כמה שאלות ה-AI החזיר לא תקינות והושמטו
  skipped: number
}

// האם ה-AI מוגדר בשרת (בלי מפתח הכפתורים לא מוצגים)
export const getAiStatusApi = async (): Promise<boolean> => {
  const response = await api.get<{ enabled: boolean }>("/ai/status")
  return response.data.enabled
}

// טיוטות בלבד: שום דבר לא נשמר עד שהמנחה בוחרת ושומרת
export const generateQuestionsApi = async ({ gameId, ...body }: GenerateQuestionsRequest & { gameId: number }): Promise<GenerateQuestionsResult> => {
  const response = await api.post<GenerateQuestionsResult>(`/games/${gameId}/ai/questions`, body)
  return response.data
}
