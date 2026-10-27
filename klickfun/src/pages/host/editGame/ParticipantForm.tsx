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
        <input className="input min-w-32 flex-1" placeholder="שם" {...register("name")} />
        <input className="input min-w-32 flex-1" placeholder="טלפון" type="tel" {...register("phone")} />
        <button className="btn btn-primary" type="submit">{isSubmitting ? "שומר..." : submitLabel}</button>
        {onCancel && <button className="btn btn-ghost" type="button" onClick={onCancel}>ביטול</button>}
        <FieldError error={errors.name} />
        <FieldError error={errors.phone} />
        {serverError && <span className="field-error basis-full" role="alert">{serverError}</span>}
      </fieldset>
    </form>
  )
}
