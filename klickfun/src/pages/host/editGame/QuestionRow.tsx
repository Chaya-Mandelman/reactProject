import { useState } from "react"
import { useDeleteQuestion, useUpdateQuestion } from "@/hooks/questions/useQuestionMutations"
import { DeleteButton } from "@/components/DeleteButton"
import { QUESTION_TYPE_LABELS } from "@/constants/question"
import type { Question } from "@/types/question"
import { QuestionForm } from "./QuestionForm"

type Props = { gameId: number; question: Question; locked: boolean }

export function QuestionRow({ gameId, question, locked }: Props) {
  const [editing, setEditing] = useState(false)
  const update = useUpdateQuestion()
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
          onSubmit={async (details) => {
            await update.mutateAsync({ ...ref, details })
            setEditing(false)
          }}
        />
      </li>
    )
  }

  return (
    <li className="rounded-xl border border-white/[0.07] bg-navy/70 p-5 text-xs text-muted/70">
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
