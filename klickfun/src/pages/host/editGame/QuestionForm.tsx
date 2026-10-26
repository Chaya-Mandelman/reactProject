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
    <form onSubmit={submit}>
      <fieldset disabled={isSubmitting}>
        <label><input type="radio" value="COMPETITIVE" {...register("type")} /> תחרותית</label>
        <label><input type="radio" value="POLL" {...register("type")} /> סקר</label>

        <div>
          <input placeholder="נוסח השאלה" {...register("text")} />
          <FieldError error={errors.text} />
        </div>

        {isCompetitive && <p>סמני את התשובה הנכונה:</p>}
        {OPTIONS.map((n) => (
          <div key={n}>
            <input placeholder={`תשובה ${n}`} {...register(`option${n}`)} />
            {isCompetitive && (
              <label><input type="radio" value={String(n)} {...register("correctOption")} /> נכונה</label>
            )}
            <FieldError error={errors[`option${n}`]} />
          </div>
        ))}
        {isCompetitive && <FieldError error={errors.correctOption} />}

        {serverError && <p role="alert">{serverError}</p>}
        <button type="submit">{isSubmitting ? "שומר..." : submitLabel}</button>
        <button type="button" onClick={onCancel}>ביטול</button>
      </fieldset>
    </form>
  )
}
