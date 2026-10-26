import { QUESTION_TYPE_LABELS } from "@/constants/question"
import { useGame } from "@/hooks/games/useGame"
import { getErrorMessage } from "@/utils/getErrorMessage"

type Props = { gameId: number; onClose: () => void }

// צפייה בלבד: מנהל המערכת לא עורך משחקים
export function GameDetailsView({ gameId, onClose }: Props) {
  const { data: game, isLoading, error } = useGame(gameId)

  return (
    <section>
      <button onClick={onClose}>סגירה</button>
      {isLoading && <div>טוען...</div>}
      {error && <div role="alert">{getErrorMessage(error)}</div>}
      {game && (
        <>
          {game.description && <p>{game.description}</p>}
          <h3>שאלות ({game.questions.length})</h3>
          <ol>
            {game.questions.map((q) => (
              <li key={q.id}>
                {q.text} ({QUESTION_TYPE_LABELS[q.type]})
                <ol>
                  {([q.option1, q.option2, q.option3, q.option4]).map((option, i) => (
                    <li key={i}>{option}{q.correctOption === i + 1 && " ✓"}</li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
          <h3>משתתפים ({game.participants.length})</h3>
          <ul>
            {game.participants.map((p) => (
              <li key={p.id}>{p.name} · {p.phone}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
