import { z } from "zod"
import { useApiForm } from "@/hooks/useApiForm"
import type { GameInput } from "@/types/game"
import { FieldError } from "./FieldError"

const gameSchema = z.object({
  title: z.string().trim().min(2, "שם המשחק קצר מדי").max(100, "שם המשחק ארוך מדי"),
  description: z.string().max(500, "התיאור ארוך מדי").optional(),
})

type Props = {
  defaultValues: GameInput
  submitLabel: string
  onSubmit: (data: GameInput) => Promise<unknown>
  onCancel?: () => void
  disabled?: boolean
}

// טופס שם ותיאור: משמש גם ליצירת משחק וגם לעריכה
export function GameForm({ defaultValues, submitLabel, onSubmit, onCancel, disabled }: Props) {
  "use no memo" // React Compiler מסתיר את השגיאות של react-hook-form
  const { register, submit, serverError, formState: { errors, isSubmitting, isSubmitSuccessful } } =
    useApiForm(gameSchema, defaultValues, onSubmit)

  return (
    <form onSubmit={submit}>
      <fieldset disabled={disabled || isSubmitting}>
        <label>שם המשחק: <input {...register("title")} /></label>
        <FieldError error={errors.title} />
        <label>תיאור: <textarea {...register("description")} /></label>
        <FieldError error={errors.description} />
        {serverError && <p role="alert">{serverError}</p>}
        <button type="submit">{isSubmitting ? "שומר..." : submitLabel}</button>
        {onCancel && <button type="button" onClick={onCancel}>ביטול</button>}
        {isSubmitSuccessful && !serverError && !onCancel && <span>נשמר ✓</span>}
      </fieldset>
    </form>
  )
}
