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
    <li className="p-5 text-xs text-[#C9BCEB]/75 rounded-2xl border border-[#A855F7]/20 bg-[#21104D]/50 transition duration-200 hover:border-[#A855F7]/45 hover:bg-[#21104D]/80 hover:border-[#F03CFF]/30">
      <strong className="me-1 text-base font-bold text-white">{question.text}</strong> ({QUESTION_TYPE_LABELS[question.type]})
      <ol className="my-4 grid grid-cols-2 gap-2">
        {options.map((text, i) => (
          <li className="rounded-xl border border-white/10 bg-[#08051F]/50 px-3 py-2 text-center text-sm font-medium text-white/90" key={i}>{text} {question.correctOption === i + 1 && "✓"}</li>
        ))}
      </ol>
      <button className="me-2 inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-8 px-3.5 text-xs border border-[#00E5FF]/30 bg-[#140A38]/80 text-[#C9BCEB] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[#00E5FF]/70 hover:bg-[#00E5FF]/10 hover:text-white hover:shadow-[0_0_18px_-4px_rgba(0,229,255,0.6)]" onClick={() => setEditing(true)} disabled={locked}>עריכה</button>
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
