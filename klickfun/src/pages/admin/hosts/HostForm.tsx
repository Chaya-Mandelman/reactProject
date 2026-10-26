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
    <form className="w-full" onSubmit={submit}>
      <fieldset className="flex flex-wrap items-center gap-3" disabled={isSubmitting}>
        <input className="min-w-40 flex-1 rounded-xl border-2 border-violet-400/40 bg-indigo-950/70 px-4 py-2.5 text-white placeholder:text-violet-300/50 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_16px_rgba(34,211,238,0.45)]" placeholder="שם" {...register("name")} />
        <input className="min-w-40 flex-1 rounded-xl border-2 border-violet-400/40 bg-indigo-950/70 px-4 py-2.5 text-white placeholder:text-violet-300/50 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_16px_rgba(34,211,238,0.45)]" placeholder="אימייל" type="email" {...register("email")} />
        <input className="min-w-40 flex-1 rounded-xl border-2 border-violet-400/40 bg-indigo-950/70 px-4 py-2.5 text-white placeholder:text-violet-300/50 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_16px_rgba(34,211,238,0.45)]"
          placeholder={isNew ? "סיסמה" : "סיסמה חדשה (לא חובה)"}
          type="password"
          autoComplete="new-password"
          {...register("password")}
        />
        <button className="cursor-pointer rounded-full font-bold transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100 border border-fuchsia-300/50 bg-linear-to-l from-fuchsia-600 via-purple-600 to-violet-600 px-6 py-2.5 text-white shadow-[0_0_20px_rgba(217,70,239,0.55)] hover:scale-105 hover:shadow-[0_0_32px_rgba(217,70,239,0.85)]" type="submit">{isSubmitting ? "שומר..." : submitLabel}</button>
        <button className="cursor-pointer rounded-full font-bold transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100 border-2 border-cyan-400/70 bg-cyan-400/5 px-5 py-2 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.35)] hover:bg-cyan-400/15 hover:shadow-[0_0_22px_rgba(34,211,238,0.6)]" type="button" onClick={onCancel}>ביטול</button>
        <FieldError error={errors.name} />
        <FieldError error={errors.email} />
        <FieldError error={errors.password} />
        {serverError && <span className="w-full text-sm font-semibold text-rose-300" role="alert">{serverError}</span>}
      </fieldset>
    </form>
  )
}
