import { isAxiosError } from "axios"
import type { ApiError, ApiErrorDetail } from "@/types/apiError"

const DEFAULT_MESSAGE = "משהו השתבש, נסי שוב"

// מחזיר את error.message מהשרת, או הודעה כללית
export function getErrorMessage(error: unknown): string {
  if (isAxiosError<ApiError>(error)) {
    if (!error.response) return "אין חיבור לשרת, נסי שוב"
    return error.response.data?.error?.message ?? DEFAULT_MESSAGE
  }
  return DEFAULT_MESSAGE
}

// שגיאות לפי שדה, כדי להציג כל אחת ליד השדה שלה בטופס
export function getErrorDetails(error: unknown): ApiErrorDetail[] {
  if (isAxiosError<ApiError>(error)) {
    return error.response?.data?.error?.details ?? []
  }
  return []
}
