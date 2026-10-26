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
    <form className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-6 max-w-2xl rounded-3xl border border-[#A855F7]/30 bg-linear-to-b from-[#21104D]/90 to-[#140A38]/90 p-6 text-start shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9),0_0_40px_-22px_rgba(168,85,247,0.7)] ring-1 ring-inset ring-white/5 backdrop-blur-xl in-[section]:m-0 in-[section]:w-full in-[section]:max-w-none in-[section]:border-0 in-[section]:bg-none in-[section]:p-0 in-[section]:shadow-none in-[section]:ring-0 in-[section]:backdrop-blur-none" onSubmit={submit}>
      <fieldset className="flex flex-wrap items-center gap-4" disabled={disabled || isSubmitting}>
        <label className="w-full flex flex-col gap-2 text-sm font-medium text-[#C9BCEB]">שם המשחק: <input className="h-11 rounded-xl border border-[#A855F7]/25 bg-[#08051F]/60 px-4 text-sm text-white placeholder:text-[#C9BCEB]/40 outline-none transition duration-200 hover:border-[#A855F7]/45 focus:border-[#00E5FF]/70 focus:bg-[#08051F]/80 focus:ring-4 focus:ring-[#00E5FF]/15" {...register("title")} /></label>
        <FieldError error={errors.title} />
        <label className="w-full flex flex-col gap-2 text-sm font-medium text-[#C9BCEB]">תיאור: <textarea className="h-11 rounded-xl border border-[#A855F7]/25 bg-[#08051F]/60 px-4 text-sm text-white placeholder:text-[#C9BCEB]/40 outline-none transition duration-200 hover:border-[#A855F7]/45 focus:border-[#00E5FF]/70 focus:bg-[#08051F]/80 focus:ring-4 focus:ring-[#00E5FF]/15 h-auto min-h-28 resize-y py-3" {...register("description")} /></label>
        <FieldError error={errors.description} />
        {serverError && <p className="w-full rounded-2xl border border-rose-400/40 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 shadow-[0_0_24px_-8px_rgba(244,63,94,0.55)] backdrop-blur-md" role="alert">{serverError}</p>}
        <button className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-11 px-6 text-sm bg-linear-to-b from-[#F03CFF] to-[#A855F7] text-white shadow-[0_4px_0_0_#6b1f9e,0_10px_28px_-6px_rgba(240,60,255,0.7)] ring-1 ring-inset ring-white/25 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_6px_0_0_#6b1f9e,0_14px_34px_-4px_rgba(240,60,255,0.9)] active:translate-y-0.5 active:shadow-[0_1px_0_0_#6b1f9e,0_6px_18px_-6px_rgba(240,60,255,0.7)]" type="submit">{isSubmitting ? "שומר..." : submitLabel}</button>
        {onCancel && <button className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-11 px-6 text-sm border border-[#00E5FF]/30 bg-[#140A38]/80 text-[#C9BCEB] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[#00E5FF]/70 hover:bg-[#00E5FF]/10 hover:text-white hover:shadow-[0_0_18px_-4px_rgba(0,229,255,0.6)]" type="button" onClick={onCancel}>ביטול</button>}
        {isSubmitSuccessful && !serverError && !onCancel && <span className="text-sm font-bold text-emerald-300">נשמר ✓</span>}
      </fieldset>
    </form>
  )
}
