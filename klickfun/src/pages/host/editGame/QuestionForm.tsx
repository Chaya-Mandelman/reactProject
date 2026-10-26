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
    <form className="rounded-2xl border border-[#F03CFF]/30 bg-[#08051F]/50 p-5 shadow-[0_0_30px_-10px_rgba(240,60,255,0.5)]" onSubmit={submit}>
      <fieldset className="flex flex-wrap items-center gap-3" disabled={isSubmitting}>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#A855F7]/25 bg-[#140A38]/80 px-4 py-2 text-sm font-medium text-[#C9BCEB] transition duration-200 hover:border-[#A855F7]/50 has-checked:border-[#F03CFF]/80 has-checked:bg-[#F03CFF]/15 has-checked:text-white has-checked:shadow-[0_0_16px_-4px_rgba(240,60,255,0.7)]"><input className="size-4 accent-[#F03CFF]" type="radio" value="COMPETITIVE" {...register("type")} /> תחרותית</label>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#A855F7]/25 bg-[#140A38]/80 px-4 py-2 text-sm font-medium text-[#C9BCEB] transition duration-200 hover:border-[#A855F7]/50 has-checked:border-[#F03CFF]/80 has-checked:bg-[#F03CFF]/15 has-checked:text-white has-checked:shadow-[0_0_16px_-4px_rgba(240,60,255,0.7)]"><input className="size-4 accent-[#F03CFF]" type="radio" value="POLL" {...register("type")} /> סקר</label>

        <div className="flex w-full flex-col gap-1.5">
          <input className="w-full h-11 rounded-xl border border-[#A855F7]/25 bg-[#08051F]/60 px-4 text-sm text-white placeholder:text-[#C9BCEB]/40 outline-none transition duration-200 hover:border-[#A855F7]/45 focus:border-[#00E5FF]/70 focus:bg-[#08051F]/80 focus:ring-4 focus:ring-[#00E5FF]/15 h-12 text-base" placeholder="נוסח השאלה" {...register("text")} />
          <FieldError error={errors.text} />
        </div>

        {isCompetitive && <p className="w-full text-sm font-semibold text-[#FFE082]">סמני את התשובה הנכונה:</p>}
        {OPTIONS.map((n) => (
          <div className="flex w-full flex-wrap items-center gap-2" key={n}>
            <input className="min-w-40 flex-1 h-11 rounded-xl border border-[#A855F7]/25 bg-[#08051F]/60 px-4 text-sm text-white placeholder:text-[#C9BCEB]/40 outline-none transition duration-200 hover:border-[#A855F7]/45 focus:border-[#00E5FF]/70 focus:bg-[#08051F]/80 focus:ring-4 focus:ring-[#00E5FF]/15" placeholder={`תשובה ${n}`} {...register(`option${n}`)} />
            {isCompetitive && (
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#A855F7]/25 bg-[#140A38]/80 px-4 py-2 text-sm font-medium text-[#C9BCEB] transition duration-200 hover:border-[#A855F7]/50 has-checked:border-[#F03CFF]/80 has-checked:bg-[#F03CFF]/15 has-checked:text-white has-checked:shadow-[0_0_16px_-4px_rgba(240,60,255,0.7)]"><input className="size-4 accent-[#F03CFF]" type="radio" value={String(n)} {...register("correctOption")} /> נכונה</label>
            )}
            <FieldError error={errors[`option${n}`]} />
          </div>
        ))}
        {isCompetitive && <FieldError error={errors.correctOption} />}

        {serverError && <p className="w-full rounded-2xl border border-rose-400/40 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 shadow-[0_0_24px_-8px_rgba(244,63,94,0.55)] backdrop-blur-md" role="alert">{serverError}</p>}
        <button className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-11 px-6 text-sm bg-linear-to-b from-[#F03CFF] to-[#A855F7] text-white shadow-[0_4px_0_0_#6b1f9e,0_10px_28px_-6px_rgba(240,60,255,0.7)] ring-1 ring-inset ring-white/25 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_6px_0_0_#6b1f9e,0_14px_34px_-4px_rgba(240,60,255,0.9)] active:translate-y-0.5 active:shadow-[0_1px_0_0_#6b1f9e,0_6px_18px_-6px_rgba(240,60,255,0.7)]" type="submit">{isSubmitting ? "שומר..." : submitLabel}</button>
        <button className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-11 px-6 text-sm border border-[#00E5FF]/30 bg-[#140A38]/80 text-[#C9BCEB] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[#00E5FF]/70 hover:bg-[#00E5FF]/10 hover:text-white hover:shadow-[0_0_18px_-4px_rgba(0,229,255,0.6)]" type="button" onClick={onCancel}>ביטול</button>
      </fieldset>
    </form>
  )
}
