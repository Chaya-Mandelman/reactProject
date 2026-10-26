import { QUESTION_TYPE_LABELS } from "@/constants/question"
import { useGame } from "@/hooks/games/useGame"
import { getErrorMessage } from "@/utils/getErrorMessage"

type Props = { gameId: number; onClose: () => void }

// צפייה בלבד: מנהל המערכת לא עורך משחקים
export function GameDetailsView({ gameId, onClose }: Props) {
  const { data: game, isLoading, error } = useGame(gameId)

  return (
    <section className="mt-3 w-full rounded-2xl border border-[#A855F7]/25 bg-[#08051F]/50 p-4 text-sm">
      <button className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-8 px-3.5 text-xs border border-[#00E5FF]/30 bg-[#140A38]/80 text-[#C9BCEB] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[#00E5FF]/70 hover:bg-[#00E5FF]/10 hover:text-white hover:shadow-[0_0_18px_-4px_rgba(0,229,255,0.6)]" onClick={onClose}>סגירה</button>
      {isLoading && <div className="animate-pulse py-4 text-[#C9BCEB]/80">טוען...</div>}
      {error && <div className="mt-3 rounded-2xl border border-rose-400/40 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 shadow-[0_0_24px_-8px_rgba(244,63,94,0.55)] backdrop-blur-md" role="alert">{getErrorMessage(error)}</div>}
      {game && (
        <>
          {game.description && <p className="mt-3 leading-relaxed text-[#C9BCEB]/80">{game.description}</p>}
          <h3 className="mt-5 mb-2 text-sm font-bold tracking-wide text-[#7DF3FF]">שאלות ({game.questions.length})</h3>
          <ol className="list-decimal space-y-3 ps-5 marker:font-bold marker:text-[#F9A8FF]">
            {game.questions.map((q) => (
              <li className="font-semibold text-white" key={q.id}>
                {q.text} ({QUESTION_TYPE_LABELS[q.type]})
                <ol className="mt-2 grid grid-cols-2 gap-1.5 font-normal text-[#C9BCEB]">
                  {([q.option1, q.option2, q.option3, q.option4]).map((option, i) => (
                    <li className="rounded-lg bg-white/5 px-2.5 py-1.5 text-xs" key={i}>{option}{q.correctOption === i + 1 && " ✓"}</li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
          <h3 className="mt-5 mb-2 text-sm font-bold tracking-wide text-[#7DF3FF]">משתתפים ({game.participants.length})</h3>
          <ul className="space-y-1.5 text-[#C9BCEB]">
            {game.participants.map((p) => (
              <li key={p.id}>{p.name} · {p.phone}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
