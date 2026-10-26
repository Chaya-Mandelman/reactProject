import type { FastestAnswer } from "@/types/liveState"
import { formatResponseTime } from "@/utils/time"

// בתחרותית: המהירים שענו נכון. בסקר: המהירים שענו
export function FastestList({ fastest }: { fastest: FastestAnswer[] }) {
  return (
    <aside className="rounded-3xl border-2 border-amber-300/60 bg-indigo-950/70 p-5 shadow-[0_0_24px_rgba(251,191,36,0.3)]">
      <h3 className="mb-3 text-center text-lg font-extrabold text-amber-200">המהירים ביותר</h3>
      {fastest.length === 0 ? (
        <p className="text-center text-violet-300/80">עדיין אין</p>
      ) : (
        <ol className="list-inside list-decimal space-y-2 marker:font-black marker:text-amber-300">
          {fastest.map((answer) => (
            <li className="rounded-xl bg-white/5 px-3 py-2 text-start text-sm font-semibold" key={answer.participantId}>
              {answer.name} · {formatResponseTime(answer.responseMs)}
            </li>
          ))}
        </ol>
      )}
    </aside>
  )
}
