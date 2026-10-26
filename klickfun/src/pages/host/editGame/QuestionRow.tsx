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
      <li className="rounded-2xl bg-white/5 p-4">
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
    <li className="rounded-2xl border border-violet-400/30 bg-white/5 p-4 transition hover:border-fuchsia-400/60 hover:bg-white/10">
      <strong className="text-lg text-white">{question.text}</strong> ({QUESTION_TYPE_LABELS[question.type]})
      <ol className="my-3 grid gap-2 sm:grid-cols-2">
        {options.map((text, i) => (
          <li className="rounded-full border-2 border-fuchsia-400/50 bg-indigo-950/70 px-4 py-2 text-center font-semibold" key={i}>{text} {question.correctOption === i + 1 && "✓"}</li>
        ))}
      </ol>
      <button className="me-2 cursor-pointer rounded-full font-bold transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100 border-2 border-cyan-400/70 bg-cyan-400/5 px-5 py-2 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.35)] hover:bg-cyan-400/15 hover:shadow-[0_0_22px_rgba(34,211,238,0.6)]" onClick={() => setEditing(true)} disabled={locked}>עריכה</button>
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
