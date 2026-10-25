import axios from "axios"
import type { FieldValues, Path, UseFormSetError } from "react-hook-form"
import type { ApiError, ApiErrorDetail } from "../types/apiError"

const DEFAULT_MESSAGE = "משהו השתבש, נסי שוב"

// מחזיר את error.message מהשרת, או הודעה כללית
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiError>(error)) {
    if (!error.response) return "אין חיבור לשרת, נסי שוב"
    return error.response.data?.error?.message ?? DEFAULT_MESSAGE
  }
  return DEFAULT_MESSAGE
}

export function getErrorDetails(error: unknown): ApiErrorDetail[] {
  if (axios.isAxiosError<ApiError>(error)) {
    return error.response?.data?.error?.details ?? []
  }
  return []
}

// מציג כל שגיאה מ-details ליד השדה המתאים בטופס
export function setFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[],
): void {
  for (const detail of getErrorDetails(error)) {
    const field = detail.field as Path<T>
    if (fields.includes(field)) {
      setError(field, { type: "server", message: detail.message })
    }
  }
}
