import { useState } from "react"
import { useDeleteQuestion, useSaveQuestion } from "@/hooks/questions/useQuestionMutations"
import { QuestionImage } from "@/components/QuestionImage"
import { DeleteButton } from "@/components/DeleteButton"
import { QUESTION_TYPE_LABELS } from "@/constants/question"
import type { Question } from "@/types/question"
import { QuestionForm } from "./QuestionForm"

type Props = { gameId: number; question: Question; locked: boolean }

export function QuestionRow({ gameId, question, locked }: Props) {
  const [editing, setEditing] = useState(false)
  const save = useSaveQuestion()
  const [imageError, setImageError] = useState<string | null>(null)
  const remove = useDeleteQuestion()
  const ref = { gameId, id: question.id }
  const options = [question.option1, question.option2, question.option3, question.option4]

  if (editing) {
    return (
      <li className="col-span-full">
        <QuestionForm
          question={question}
          submitLabel="שמירה"
          onCancel={() => setEditing(false)}
          onSubmit={async (details, image) => {
            const result = await save.mutateAsync({ ...ref, details, image })
            setImageError(result.imageError)
            setEditing(false)
          }}
        />
      </li>
    )
  }

  return (
    <li className="rounded-xl border border-white/[0.07] bg-navy/70 p-5 text-xs text-muted/70">
      <QuestionImage imageId={question.imageId} className="mb-3 max-h-32" />
      <strong className="me-1 text-base font-bold break-words text-white">{question.text}</strong> ({QUESTION_TYPE_LABELS[question.type]})
      <ol className="my-4 grid grid-cols-2 gap-2">
        {options.map((text, i) => (
          <li
            className={`rounded-lg border px-3 py-2 text-center text-sm font-medium break-words ${question.correctOption === i + 1 ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-200" : "border-white/10 bg-bg/50 text-white/90"}`}
            key={i}
          >
            {text} {question.correctOption === i + 1 && "✓"}
          </li>
        ))}
      </ol>
      {imageError && <p className="alert mb-3" role="alert">{imageError}</p>}
      <button className="btn btn-sm btn-ghost me-2" onClick={() => setEditing(true)} disabled={locked}>עריכה</button>
      <DeleteButton
        confirmText="למחוק את השאלה?"
        onConfirm={() => remove.mutate(ref)}
        isPending={remove.isPending}
        error={remove.error}
        disabled={locked}
      />
    </li>
  )
}
