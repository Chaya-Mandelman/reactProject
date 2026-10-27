import { useAddQuestion } from "@/hooks/questions/useQuestionMutations"
import { OpenButton } from "@/components/OpenButton"
import type { GameDetails } from "@/types/game"
import { QuestionForm } from "./QuestionForm"
import { QuestionRow } from "./QuestionRow"

export function Questions({ game, locked }: { game: GameDetails; locked: boolean }) {
  const add = useAddQuestion()

  return (
    <section className="card mt-6">
      <h2 className="section-title">שאלות ({game.questions.length})</h2>
      {!locked && (
        <OpenButton label="הוספת שאלה">
          {(close) => (
            <QuestionForm
              submitLabel="הוספה"
              onCancel={close}
              onSubmit={async (details) => {
                await add.mutateAsync({ gameId: game.id, details })
                close()
              }}
            />
          )}
        </OpenButton>
      )}
      {game.questions.length === 0 && <p className="empty mt-4">עדיין אין שאלות</p>}
      <ol className="mt-4 grid gap-4 lg:grid-cols-2">
        {game.questions.map((question) => (
          <QuestionRow key={question.id} gameId={game.id} question={question} locked={locked} />
        ))}
      </ol>
    </section>
  )
}
