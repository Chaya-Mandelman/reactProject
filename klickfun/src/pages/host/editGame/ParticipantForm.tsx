import { z } from "zod"
import { useApiForm } from "@/hooks/useApiForm"
import { FieldError } from "@/components/FieldError"
import type { ParticipantInput } from "@/types/participant"

// את תקינות הטלפון השרת בודק ומחזיר הודעה מדויקת
const participantSchema = z.object({
  name: z.string().trim().min(2, "שם קצר מדי").max(60, "שם ארוך מדי"),
  phone: z.string().trim().min(1, "טלפון חובה"),
})

const EMPTY_PARTICIPANT: ParticipantInput = { name: "", phone: "" }

type Props = {
  defaultValues?: ParticipantInput
  submitLabel: string
  onSubmit: (data: ParticipantInput) => Promise<unknown>
  onCancel?: () => void
}

// משמש גם להוספה וגם לעריכה
export function ParticipantForm({ defaultValues = EMPTY_PARTICIPANT, submitLabel, onSubmit, onCancel }: Props) {
  "use no memo" // React Compiler מסתיר את השגיאות של react-hook-form
  const { register, submit, serverError, formState: { errors, isSubmitting } } =
    useApiForm(participantSchema, defaultValues, onSubmit)

  return (
    <form className="w-full" onSubmit={submit}>
      <fieldset className="flex flex-wrap items-center gap-2" disabled={isSubmitting}>
        <input className="min-w-40 flex-1 h-11 rounded-xl border border-[#A855F7]/25 bg-[#08051F]/60 px-4 text-sm text-white placeholder:text-[#C9BCEB]/40 outline-none transition duration-200 hover:border-[#A855F7]/45 focus:border-[#00E5FF]/70 focus:bg-[#08051F]/80 focus:ring-4 focus:ring-[#00E5FF]/15" placeholder="שם" {...register("name")} />
        <input className="min-w-40 flex-1 h-11 rounded-xl border border-[#A855F7]/25 bg-[#08051F]/60 px-4 text-sm text-white placeholder:text-[#C9BCEB]/40 outline-none transition duration-200 hover:border-[#A855F7]/45 focus:border-[#00E5FF]/70 focus:bg-[#08051F]/80 focus:ring-4 focus:ring-[#00E5FF]/15" placeholder="טלפון" type="tel" {...register("phone")} />
        <button className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-11 px-6 text-sm bg-linear-to-b from-[#F03CFF] to-[#A855F7] text-white shadow-[0_4px_0_0_#6b1f9e,0_10px_28px_-6px_rgba(240,60,255,0.7)] ring-1 ring-inset ring-white/25 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_6px_0_0_#6b1f9e,0_14px_34px_-4px_rgba(240,60,255,0.9)] active:translate-y-0.5 active:shadow-[0_1px_0_0_#6b1f9e,0_6px_18px_-6px_rgba(240,60,255,0.7)]" type="submit">{isSubmitting ? "שומר..." : submitLabel}</button>
        {onCancel && <button className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-11 px-6 text-sm border border-[#00E5FF]/30 bg-[#140A38]/80 text-[#C9BCEB] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[#00E5FF]/70 hover:bg-[#00E5FF]/10 hover:text-white hover:shadow-[0_0_18px_-4px_rgba(0,229,255,0.6)]" type="button" onClick={onCancel}>ביטול</button>}
        <FieldError error={errors.name} />
        <FieldError error={errors.phone} />
        {serverError && <span className="w-full text-xs font-semibold text-rose-300" role="alert">{serverError}</span>}
      </fieldset>
    </form>
  )
}
