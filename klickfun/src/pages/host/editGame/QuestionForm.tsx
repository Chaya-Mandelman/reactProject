import { z } from "zod"
import { useWatch } from "react-hook-form"
import { useApiForm } from "@/hooks/useApiForm"
import { FieldError } from "@/components/FieldError"
import type { OptionNumber, Question, QuestionInput } from "@/types/question"

const OPTIONS = [1, 2, 3, 4] as const
const option = (n: number) => z.string().trim().min(1, `תשובה ${n} חובה`).max(120, `תשובה ${n} ארוכה מדי`)

const questionSchema = z
  .object({
    type: z.enum(["COMPETITIVE", "POLL"]),
    text: z.string().trim().min(2, "השאלה קצרה מדי").max(300, "השאלה ארוכה מדי"),
    option1: option(1),
    option2: option(2),
    option3: option(3),
    option4: option(4),
    // ערך של radio הוא תמיד טקסט, ולכן "1" עד "4" (או "" כשלא נבחר)
    correctOption: z.string(),
  })
  .refine((q) => q.type === "POLL" || q.correctOption !== "", {
    message: "יש לבחור את התשובה הנכונה",
    path: ["correctOption"],
  })
  .refine((q) => new Set([q.option1, q.option2, q.option3, q.option4]).size === 4, {
    message: "ארבע התשובות חייבות להיות שונות",
    path: ["option4"],
  })

type QuestionValues = z.infer<typeof questionSchema>

const toValues = (q?: Question): QuestionValues => ({
  type: q?.type ?? "COMPETITIVE",
  text: q?.text ?? "",
  option1: q?.option1 ?? "",
  option2: q?.option2 ?? "",
  option3: q?.option3 ?? "",
  option4: q?.option4 ?? "",
  correctOption: q?.correctOption ? String(q.correctOption) : "",
})

// בסקר לא שולחים תשובה נכונה
const toInput = ({ correctOption, ...q }: QuestionValues): QuestionInput => ({
  ...q,
  correctOption: q.type === "POLL" ? null : (Number(correctOption) as OptionNumber),
})

type Props = {
  question?: Question
  submitLabel: string
  onSubmit: (data: QuestionInput) => Promise<unknown>
  onCancel: () => void
}

export function QuestionForm({ question, submitLabel, onSubmit, onCancel }: Props) {
  "use no memo" // React Compiler מסתיר את השגיאות של react-hook-form
  const { register, control, submit, serverError, formState: { errors, isSubmitting } } =
    useApiForm(questionSchema, toValues(question), (values) => onSubmit(toInput(values)))
  const isCompetitive = useWatch({ control, name: "type" }) === "COMPETITIVE"

  return (
    <form className="mt-2 rounded-2xl border border-cyan-400/40 bg-indigo-950/60 p-4" onSubmit={submit}>
      <fieldset className="flex flex-col gap-3" disabled={isSubmitting}>
        <label className="inline-flex cursor-pointer items-center gap-2 font-semibold text-violet-200"><input className="size-4 accent-fuchsia-500" type="radio" value="COMPETITIVE" {...register("type")} /> תחרותית</label>
        <label className="inline-flex cursor-pointer items-center gap-2 font-semibold text-violet-200"><input className="size-4 accent-fuchsia-500" type="radio" value="POLL" {...register("type")} /> סקר</label>

        <div className="flex flex-col gap-1">
          <input className="w-full rounded-xl border-2 border-violet-400/40 bg-indigo-950/70 px-4 py-2.5 text-white placeholder:text-violet-300/50 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_16px_rgba(34,211,238,0.45)]" placeholder="נוסח השאלה" {...register("text")} />
          <FieldError error={errors.text} />
        </div>

        {isCompetitive && <p className="font-semibold text-amber-200">סמני את התשובה הנכונה:</p>}
        {OPTIONS.map((n) => (
          <div className="flex flex-wrap items-center gap-3" key={n}>
            <input className="min-w-40 flex-1 rounded-xl border-2 border-violet-400/40 bg-indigo-950/70 px-4 py-2.5 text-white placeholder:text-violet-300/50 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_16px_rgba(34,211,238,0.45)]" placeholder={`תשובה ${n}`} {...register(`option${n}`)} />
            {isCompetitive && (
              <label className="inline-flex cursor-pointer items-center gap-2 font-semibold text-violet-200"><input className="size-4 accent-fuchsia-500" type="radio" value={String(n)} {...register("correctOption")} /> נכונה</label>
            )}
            <FieldError error={errors[`option${n}`]} />
          </div>
        ))}
        {isCompetitive && <FieldError error={errors.correctOption} />}

        {serverError && <p className="rounded-xl border border-rose-400/60 bg-rose-500/15 px-4 py-2 font-semibold text-rose-200" role="alert">{serverError}</p>}
        <button className="self-start cursor-pointer rounded-full font-bold transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100 border border-fuchsia-300/50 bg-linear-to-l from-fuchsia-600 via-purple-600 to-violet-600 px-6 py-2.5 text-white shadow-[0_0_20px_rgba(217,70,239,0.55)] hover:scale-105 hover:shadow-[0_0_32px_rgba(217,70,239,0.85)]" type="submit">{isSubmitting ? "שומר..." : submitLabel}</button>
        <button className="self-start cursor-pointer rounded-full font-bold transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100 border-2 border-cyan-400/70 bg-cyan-400/5 px-5 py-2 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.35)] hover:bg-cyan-400/15 hover:shadow-[0_0_22px_rgba(34,211,238,0.6)]" type="button" onClick={onCancel}>ביטול</button>
      </fieldset>
    </form>
  )
}
