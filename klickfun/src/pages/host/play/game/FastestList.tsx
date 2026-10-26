import type { FastestAnswer } from "@/types/liveState"
import { formatResponseTime } from "@/utils/time"

// בתחרותית: המהירים שענו נכון. בסקר: המהירים שענו
export function FastestList({ fastest }: { fastest: FastestAnswer[] }) {
  return (
    <aside>
      <h3>המהירים ביותר</h3>
      {fastest.length === 0 ? (
        <p>עדיין אין</p>
      ) : (
        <ol>
          {fastest.map((answer) => (
            <li key={answer.participantId}>
              {answer.name} · {formatResponseTime(answer.responseMs)}
            </li>
          ))}
        </ol>
      )}
    </aside>
  )
}
