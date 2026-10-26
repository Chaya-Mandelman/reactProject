import { useState } from "react"
import { useForm, type DefaultValues, type FieldValues, type Path } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { getErrorDetails, getErrorMessage } from "../utils/getErrorMessage"

// טופס עם zod ששולח לשרת, ומציג את שגיאות השרת ליד השדות ובהודעה כללית
export function useApiForm<T extends FieldValues>(
  schema: z.ZodType<T, T>,
  defaultValues: DefaultValues<T>,
  onSubmit: (data: T) => Promise<unknown>|unknown,
  
) {
  const [serverError, setServerError] = useState<string | null>(null)
  const form = useForm<T>({ resolver: zodResolver(schema), mode: "onChange", defaultValues })

  const submit = form.handleSubmit(async (data) => {
    setServerError(null)
    try {
      await onSubmit(data)
    } catch (error) {
      for (const detail of getErrorDetails(error)) {
        form.setError(detail.field as Path<T>, { type: "server", message: detail.message })
      }
      setServerError(getErrorMessage(error))
    }
  })

  return { ...form, submit, serverError }
}
