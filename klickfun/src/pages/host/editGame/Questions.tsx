import { useAddQuestion } from "@/hooks/questions/useQuestionMutations"
import { OpenButton } from "@/components/OpenButton"
import type { GameDetails } from "@/types/game"
import { QuestionForm } from "./QuestionForm"
import { QuestionRow } from "./QuestionRow"

export function Questions({ game, locked }: { game: GameDetails; locked: boolean }) {
  const add = useAddQuestion()

  return (
    <section className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-8 rounded-3xl border-2 border-fuchsia-400/50 bg-indigo-950/70 p-6 shadow-[0_0_30px_rgba(168,85,247,0.35),inset_0_0_30px_rgba(168,85,247,0.15)] backdrop-blur-md">
      <h2 className="mb-5 text-2xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]">שאלות ({game.questions.length})</h2>
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
      {game.questions.length === 0 && <p className="my-4 text-violet-300/80">עדיין אין שאלות</p>}
      <ol className="mt-4 space-y-4">
        {game.questions.map((question) => (
          <QuestionRow key={question.id} gameId={game.id} question={question} locked={locked} />
        ))}
      </ol>
    </section>
  )
}
