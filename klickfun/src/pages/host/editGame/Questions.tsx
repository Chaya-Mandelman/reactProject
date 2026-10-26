import { useAddQuestion } from "@/hooks/questions/useQuestionMutations"
import { OpenButton } from "@/components/OpenButton"
import type { GameDetails } from "@/types/game"
import { QuestionForm } from "./QuestionForm"
import { QuestionRow } from "./QuestionRow"

export function Questions({ game, locked }: { game: GameDetails; locked: boolean }) {
  const add = useAddQuestion()

  return (
    <section className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-6 block rounded-3xl border border-[#A855F7]/30 bg-linear-to-b from-[#21104D]/90 to-[#140A38]/90 p-5 sm:p-6 text-start shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9),0_0_40px_-22px_rgba(168,85,247,0.7)] ring-1 ring-inset ring-white/5 backdrop-blur-xl">
      <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white before:h-6 before:w-1.5 before:rounded-full before:bg-linear-to-b before:from-[#F03CFF] before:to-[#00E5FF] before:shadow-[0_0_10px_rgba(240,60,255,0.7)]">שאלות ({game.questions.length})</h2>
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
      {game.questions.length === 0 && <p className="mt-5 rounded-2xl border border-dashed border-[#A855F7]/30 bg-[#140A38]/40 py-8 text-center text-sm text-[#C9BCEB]/75">עדיין אין שאלות</p>}
      <ol className="mt-5 grid gap-4 lg:grid-cols-2">
        {game.questions.map((question) => (
          <QuestionRow key={question.id} gameId={game.id} question={question} locked={locked} />
        ))}
      </ol>
    </section>
  )
}
