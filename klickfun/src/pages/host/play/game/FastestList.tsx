import type { FastestAnswer } from "@/types/liveState"
import { formatResponseTime } from "@/utils/time"

// בתחרותית: המהירים שענו נכון. בסקר: המהירים שענו
export function FastestList({ fastest }: { fastest: FastestAnswer[] }) {
  return (
    <aside className="card min-h-48 px-5 py-7">
      <h3 className="section-title mb-4 text-center text-lg">המהירים ביותר</h3>
      {fastest.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted/60">עדיין אין</p>
      ) : (
        <ol className="list-inside list-decimal space-y-2 marker:font-black marker:text-gold">
          {fastest.map((answer) => (
            <li className="rounded-lg border border-cyan/15 bg-navy-2/60 px-3 py-2 text-sm font-semibold break-words text-white tabular-nums" key={answer.participantId}>
              {answer.name} · {formatResponseTime(answer.responseMs)}
            </li>
          ))}
        </ol>
      )}
    </aside>
  )
}
