import { QUESTION_TYPE_LABELS } from "@/constants/question"
import { useGame } from "@/hooks/games/useGame"
import { getErrorMessage } from "@/utils/getErrorMessage"

type Props = { gameId: number; onClose: () => void }

// צפייה בלבד: מנהל המערכת לא עורך משחקים
export function GameDetailsView({ gameId, onClose }: Props) {
  const { data: game, isLoading, error } = useGame(gameId)

  return (
    <section className="w-full rounded-xl border border-white/10 bg-bg/60 p-4 text-sm">
      <button className="btn btn-sm btn-ghost" onClick={onClose}>סגירה</button>
      {isLoading && <div className="animate-pulse py-4 text-muted motion-reduce:animate-none">טוען...</div>}
      {error && <div className="alert mt-3" role="alert">{getErrorMessage(error)}</div>}
      {game && (
        <>
          {game.description && <p className="mt-3 leading-relaxed text-muted">{game.description}</p>}
          <h3 className="mt-5 mb-2 text-sm font-bold text-cyan">שאלות ({game.questions.length})</h3>
          <ol className="list-decimal space-y-3 ps-5 marker:font-bold marker:text-gold">
            {game.questions.map((q) => (
              <li className="font-semibold break-words text-white" key={q.id}>
                {q.text} ({QUESTION_TYPE_LABELS[q.type]})
                <ol className="mt-2 grid grid-cols-2 gap-1.5 font-normal">
                  {([q.option1, q.option2, q.option3, q.option4]).map((option, i) => (
                    <li className="rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-muted" key={i}>{option}{q.correctOption === i + 1 && " ✓"}</li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
          <h3 className="mt-5 mb-2 text-sm font-bold text-cyan">משתתפים ({game.participants.length})</h3>
          <ul className="space-y-1.5 text-muted">
            {game.participants.map((p) => (
              <li key={p.id}>{p.name} · {p.phone}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
