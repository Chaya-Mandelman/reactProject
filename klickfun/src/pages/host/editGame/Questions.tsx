import { useState } from "react"
import { useSaveQuestion } from "@/hooks/questions/useQuestionMutations"
import { OpenButton } from "@/components/OpenButton"
import type { GameDetails } from "@/types/game"
import { QuestionForm } from "./QuestionForm"
import { QuestionRow } from "./QuestionRow"

export function Questions({ game, locked }: { game: GameDetails; locked: boolean }) {
  const save = useSaveQuestion()
  // השאלה נשמרה אבל התמונה לא: הטופס נסגר וההודעה מוצגת כאן
  const [imageError, setImageError] = useState<string | null>(null)

  return (
    <section className="card mt-6">
      <h2 className="section-title">שאלות ({game.questions.length})</h2>
      {!locked && (
        <OpenButton label="הוספת שאלה">
          {(close) => (
            <QuestionForm
              submitLabel="הוספה"
              onCancel={close}
              onSubmit={async (details, image) => {
                const result = await save.mutateAsync({ gameId: game.id, details, image })
                setImageError(result.imageError)
                close()
              }}
            />
          )}
        </OpenButton>
      )}
      {imageError && <p className="alert mt-4" role="alert">{imageError}</p>}
      {game.questions.length === 0 && <p className="empty mt-4">עדיין אין שאלות</p>}
      <ol className="mt-4 grid gap-4 lg:grid-cols-2">
        {game.questions.map((question) => (
          <QuestionRow key={question.id} gameId={game.id} question={question} locked={locked} />
        ))}
      </ol>
    </section>
  )
}
