import { QUESTION_TYPE_LABELS } from "@/constants/question"
import { useGame } from "@/hooks/games/useGame"
import { getErrorMessage } from "@/utils/getErrorMessage"

type Props = { gameId: number; onClose: () => void }

// צפייה בלבד: מנהל המערכת לא עורך משחקים
export function GameDetailsView({ gameId, onClose }: Props) {
  const { data: game, isLoading, error } = useGame(gameId)

  return (
    <section className="mt-2 w-full rounded-2xl border border-cyan-400/40 bg-indigo-950/80 p-4 text-start">
      <button className="cursor-pointer rounded-full font-bold transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100 border-2 border-cyan-400/70 bg-cyan-400/5 px-5 py-2 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.35)] hover:bg-cyan-400/15 hover:shadow-[0_0_22px_rgba(34,211,238,0.6)]" onClick={onClose}>סגירה</button>
      {isLoading && <div className="animate-pulse py-4 text-violet-200">טוען...</div>}
      {error && <div className="mt-3 rounded-xl border border-rose-400/60 bg-rose-500/15 px-4 py-2 font-semibold text-rose-200" role="alert">{getErrorMessage(error)}</div>}
      {game && (
        <>
          {game.description && <p className="mt-3 text-violet-200">{game.description}</p>}
          <h3 className="mt-4 mb-2 text-lg font-bold text-cyan-200">שאלות ({game.questions.length})</h3>
          <ol className="list-decimal space-y-3 ps-6 marker:text-fuchsia-300">
            {game.questions.map((q) => (
              <li className="font-semibold" key={q.id}>
                {q.text} ({QUESTION_TYPE_LABELS[q.type]})
                <ol className="mt-1 grid grid-cols-2 gap-1 text-sm font-normal text-violet-200">
                  {([q.option1, q.option2, q.option3, q.option4]).map((option, i) => (
                    <li className="rounded-lg bg-white/5 px-2 py-1" key={i}>{option}{q.correctOption === i + 1 && " ✓"}</li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
          <h3 className="mt-4 mb-2 text-lg font-bold text-cyan-200">משתתפים ({game.participants.length})</h3>
          <ul className="space-y-1 text-sm">
            {game.participants.map((p) => (
              <li key={p.id}>{p.name} · {p.phone}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
