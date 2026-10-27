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
    <form className="card mx-auto w-full max-w-2xlin-[section]:m-0 in-[section]:max-w-none in-[section]:border-0 in-[section]:bg-transparent in-[section]:p-0 in-[section]:shadow-none in-[section]:backdrop-blur-none in-[section]:[border-image:none] in-[section]:filter-none" onSubmit={submit}>
      <fieldset className="flex flex-col gap-4" disabled={disabled || isSubmitting}>
        <label className="field">שם המשחק: <input className="input" {...register("title")} /></label>
        <FieldError error={errors.title} />
        <label className="field">תיאור: <textarea className="input h-auto min-h-28 resize-y py-3" {...register("description")} /></label>
        <FieldError error={errors.description} />
        {serverError && <p className="alert" role="alert">{serverError}</p>}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button className="btn btn-primary" type="submit">{isSubmitting ? "שומר..." : submitLabel}</button>
          {onCancel && <button className="btn btn-ghost" type="button" onClick={onCancel}>ביטול</button>}
          {isSubmitSuccessful && !serverError && !onCancel && <span className="text-sm font-bold text-emerald-300">נשמר ✓</span>}
        </div>
      </fieldset>
    </form>
  )
}
