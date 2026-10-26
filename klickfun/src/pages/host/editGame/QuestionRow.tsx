import { useState } from "react"
import { useDeleteQuestion, useUpdateQuestion } from "../../../hooks/questions/useQuestionMutations"
import { DeleteButton } from "../../../components/DeleteButton"
import type { Question } from "../../../types/question"
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
      <li>
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
    <li>
      <strong>{question.text}</strong> ({question.type === "POLL" ? "סקר" : "תחרותית"})
      <ol>
        {options.map((text, i) => (
          <li key={i}>{text} {question.correctOption === i + 1 && "✓"}</li>
        ))}
      </ol>
      <button onClick={() => setEditing(true)} disabled={locked}>עריכה</button>
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
