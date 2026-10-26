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
    <form className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 rounded-3xl border-2 border-fuchsia-400/50 bg-indigo-950/70 p-6 shadow-[0_0_30px_rgba(168,85,247,0.35),inset_0_0_30px_rgba(168,85,247,0.15)] backdrop-blur-md" onSubmit={submit}>
      <fieldset className="flex flex-col gap-3" disabled={disabled || isSubmitting}>
        <label className="flex flex-col gap-1.5 font-semibold text-violet-200">שם המשחק: <input className="rounded-xl border-2 border-violet-400/40 bg-indigo-950/70 px-4 py-2.5 text-white placeholder:text-violet-300/50 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_16px_rgba(34,211,238,0.45)]" {...register("title")} /></label>
        <FieldError error={errors.title} />
        <label className="flex flex-col gap-1.5 font-semibold text-violet-200">תיאור: <textarea className="min-h-24 resize-y rounded-xl border-2 border-violet-400/40 bg-indigo-950/70 px-4 py-2.5 text-white placeholder:text-violet-300/50 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_16px_rgba(34,211,238,0.45)]" {...register("description")} /></label>
        <FieldError error={errors.description} />
        {serverError && <p className="rounded-xl border border-rose-400/60 bg-rose-500/15 px-4 py-2 font-semibold text-rose-200" role="alert">{serverError}</p>}
        <button className="self-start cursor-pointer rounded-full font-bold transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100 border border-fuchsia-300/50 bg-linear-to-l from-fuchsia-600 via-purple-600 to-violet-600 px-6 py-2.5 text-white shadow-[0_0_20px_rgba(217,70,239,0.55)] hover:scale-105 hover:shadow-[0_0_32px_rgba(217,70,239,0.85)]" type="submit">{isSubmitting ? "שומר..." : submitLabel}</button>
        {onCancel && <button className="self-start cursor-pointer rounded-full font-bold transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100 border-2 border-cyan-400/70 bg-cyan-400/5 px-5 py-2 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.35)] hover:bg-cyan-400/15 hover:shadow-[0_0_22px_rgba(34,211,238,0.6)]" type="button" onClick={onCancel}>ביטול</button>}
        {isSubmitSuccessful && !serverError && !onCancel && <span className="font-bold text-emerald-300">נשמר ✓</span>}
      </fieldset>
    </form>
  )
}
