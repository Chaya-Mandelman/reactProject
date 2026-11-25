import { useState } from "react"
import { z } from "zod"
import { generateQuestionsApi, type AiDifficulty, type AiQuestionKind } from "@/api/ai"
import { addQuestionsBulkApi } from "@/api/questions"
import { FieldError } from "@/components/FieldError"
import { QUESTION_TYPE_LABELS } from "@/constants/question"
import { useGameMutation } from "@/hooks/games/useGameMutation"
import { useApiForm } from "@/hooks/useApiForm"
import type { QuestionInput } from "@/types/question"
import { getErrorMessage } from "@/utils/getErrorMessage"

const requestSchema = z.object({
  topic: z.string().trim().min(2, "הנושא קצר מדי").max(200, "הנושא ארוך מדי"),
  // ערך של select הוא תמיד טקסט
  count: z.string(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  kind: z.enum(["COMPETITIVE", "POLL", "MIXED"]),
  notes: z.string().trim().max(500, "ההערות ארוכות מדי"),
})
type RequestValues = z.infer<typeof requestSchema>

const DEFAULTS: RequestValues = { topic: "", count: "5", difficulty: "MEDIUM", kind: "COMPETITIVE", notes: "" }
const COUNTS = [3, 5, 8, 10, 15, 20]
const DIFFICULTIES: [AiDifficulty, string][] = [["EASY", "קלה"], ["MEDIUM", "בינונית"], ["HARD", "קשה"]]
const KINDS: [AiQuestionKind, string][] = [["COMPETITIVE", "תחרותיות"], ["POLL", "סקר"], ["MIXED", "מעורב"]]

type Draft = { question: QuestionInput; selected: boolean }

type Props = { gameId: number; onClose: () => void }

// יצירת שאלות עם AI: בקשה, תצוגה ובחירה, ושמירה של השאלות שנבחרו בבת אחת
export function AiQuestions({ gameId, onClose }: Props) {
  "use no memo" // React Compiler מסתיר את השגיאות של react-hook-form
  const [drafts, setDrafts] = useState<Draft[] | null>(null)
  const [skipped, setSkipped] = useState(0)
  const save = useGameMutation(addQuestionsBulkApi)

  const { register, submit, serverError, formState: { errors, isSubmitting } } = useApiForm(requestSchema, DEFAULTS, async (values) => {
    const result = await generateQuestionsApi({
      gameId,
      topic: values.topic,
      count: Number(values.count),
      difficulty: values.difficulty,
      kind: values.kind,
      notes: values.notes || undefined,
    })
    setDrafts(result.questions.map((question) => ({ question, selected: true })))
    setSkipped(result.skipped)
  })

  const chosen = drafts?.filter((d) => d.selected).map((d) => d.question) ?? []
  const toggle = (index: number) =>
    setDrafts((prev) => prev && prev.map((d, i) => (i === index ? { ...d, selected: !d.selected } : d)))

  const saveChosen = async () => {
    await save.mutateAsync({ gameId, questions: chosen })
    onClose()
  }

  return (
    <div className="rounded-xl border border-gold/30 bg-bg/50 p-5 text-start">
      <h3 className="mb-4 font-bold text-gold">✨ יצירת שאלות עם AI</h3>

      <form onSubmit={submit}>
        <fieldset className="flex flex-wrap items-center gap-3" disabled={isSubmitting || save.isPending}>
          <div className="flex w-full flex-col gap-1.5">
            <input className="input h-12 w-full text-base" placeholder="נושא, למשל: מערכת השמש, פרשת השבוע, שברים" {...register("topic")} />
            <FieldError error={errors.topic} />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted">
            כמה שאלות
            <select className="input h-10" {...register("count")}>
              {COUNTS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-muted">
            רמה
            <select className="input h-10" {...register("difficulty")}>
              {DIFFICULTIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-muted">
            סוג
            <select className="input h-10" {...register("kind")}>
              {KINDS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <div className="flex w-full flex-col gap-1.5">
            <input className="input w-full" placeholder="הערות (לא חובה), למשל: לכיתה ד, בלי תאריכים" {...register("notes")} />
            <FieldError error={errors.notes} />
          </div>
          {serverError && <p className="alert w-full" role="alert">{serverError}</p>}
          <button className="btn btn-primary" type="submit">
            {isSubmitting ? "ה-AI כותב שאלות... (עד דקה)" : drafts ? "יצירה מחדש" : "יצירת שאלות"}
          </button>
          <button className="btn btn-ghost" type="button" onClick={onClose}>ביטול</button>
        </fieldset>
      </form>

      {drafts && (
        <div className="mt-6">
          <p className="mb-3 text-sm text-muted">
            {drafts.length === 0 ? "ה-AI לא החזיר שאלות תקינות. נסי לנסח את הנושא אחרת." : "בדקי את השאלות וסמני את אלה שרוצים לשמור. אחרי השמירה אפשר לערוך כל שאלה כרגיל."}
            {skipped > 0 && ` (${skipped} שאלות לא תקינות הושמטו)`}
          </p>
          <ol className="grid gap-3 lg:grid-cols-2">
            {drafts.map(({ question, selected }, i) => {
              const options = [question.option1, question.option2, question.option3, question.option4]
              return (
                <li key={i} className={`rounded-xl border p-4 text-xs text-muted/70 ${selected ? "border-gold/50 bg-navy/70" : "border-white/[0.07] bg-navy/30 opacity-60"}`}>
                  <label className="flex cursor-pointer items-start gap-2">
                    <input className="mt-1 size-4 accent-gold" type="checkbox" checked={selected} onChange={() => toggle(i)} />
                    <span><strong className="text-sm font-bold break-words text-white">{question.text}</strong> ({QUESTION_TYPE_LABELS[question.type]})</span>
                  </label>
                  <ol className="mt-3 grid grid-cols-2 gap-2">
                    {options.map((text, n) => (
                      <li key={n} className={`rounded-lg border px-2 py-1.5 text-center break-words ${question.correctOption === n + 1 ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-200" : "border-white/10 bg-bg/50 text-white/90"}`}>
                        {text} {question.correctOption === n + 1 && "✓"}
                      </li>
                    ))}
                  </ol>
                </li>
              )
            })}
          </ol>
          {save.error && <p className="alert mt-4" role="alert">{getErrorMessage(save.error)}</p>}
          {drafts.length > 0 && (
            <button className="btn btn-gold mt-4" type="button" disabled={chosen.length === 0 || save.isPending || isSubmitting} onClick={saveChosen}>
              {save.isPending ? "שומר..." : `שמירת ${chosen.length} שאלות`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
