import { z } from "zod"
import { useApiForm } from "@/hooks/useApiForm"
import { FieldError } from "@/components/FieldError"
import type { HostInput } from "@/types/host"

const password = z.string().min(8, "סיסמה של 8 תווים לפחות").max(72, "הסיסמה ארוכה מדי")

const hostSchema = z.object({
  name: z.string().trim().min(2, "שם קצר מדי").max(80, "שם ארוך מדי"),
  email: z.email("אימייל לא תקין").max(120, "אימייל ארוך מדי"),
  // בעריכה שדה ריק משאיר את הסיסמה הקיימת
  password: password.or(z.literal("")),
})

const newHostSchema = hostSchema.extend({ password })

type Props = {
  defaultValues?: Omit<HostInput, "password">
  submitLabel: string
  onSubmit: (data: HostInput) => Promise<unknown>
  onCancel: () => void
}

// משמש גם להוספה וגם לעריכה: בלי defaultValues זה מנחה חדש והסיסמה חובה
export function HostForm({ defaultValues, submitLabel, onSubmit, onCancel }: Props) {
  "use no memo" // React Compiler מסתיר את השגיאות של react-hook-form
  const isNew = !defaultValues
  const { register, submit, serverError, formState: { errors, isSubmitting } } = useApiForm(
    isNew ? newHostSchema : hostSchema,
    { name: "", email: "", ...defaultValues, password: "" },
    ({ password, ...details }) => onSubmit(password ? { ...details, password } : details),
  )

  return (
    <form onSubmit={submit}>
      <fieldset disabled={isSubmitting}>
        <input placeholder="שם" {...register("name")} />
        <input placeholder="אימייל" type="email" {...register("email")} />
        <input
          placeholder={isNew ? "סיסמה" : "סיסמה חדשה (לא חובה)"}
          type="password"
          autoComplete="new-password"
          {...register("password")}
        />
        <button type="submit">{isSubmitting ? "שומר..." : submitLabel}</button>
        <button type="button" onClick={onCancel}>ביטול</button>
        <FieldError error={errors.name} />
        <FieldError error={errors.email} />
        <FieldError error={errors.password} />
        {serverError && <span role="alert">{serverError}</span>}
      </fieldset>
    </form>
  )
}
