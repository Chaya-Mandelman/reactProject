import type { FastestAnswer } from "@/types/liveState"
import { formatResponseTime } from "@/utils/time"

// בתחרותית: המהירים שענו נכון. בסקר: המהירים שענו
export function FastestList({ fastest }: { fastest: FastestAnswer[] }) {
  return (
    <aside className="rounded-3xl border border-[#FFCA28]/35 bg-linear-to-b from-[#21104D]/90 to-[#140A38]/90 p-5 text-start shadow-[0_0_30px_-6px_rgba(255,202,40,0.35)] backdrop-blur-xl">
      <h3 className="mb-4 text-center text-sm font-extrabold tracking-wide text-[#FFE082]">המהירים ביותר</h3>
      {fastest.length === 0 ? (
        <p className="py-4 text-center text-sm text-[#C9BCEB]/60">עדיין אין</p>
      ) : (
        <ol className="list-inside list-decimal space-y-2 marker:font-black marker:text-[#FFCA28]">
          {fastest.map((answer) => (
            <li className="rounded-xl border border-[#FFCA28]/10 bg-[#08051F]/50 px-3 py-2 text-sm font-medium tabular-nums break-words text-white/90" key={answer.participantId}>
              {answer.name} · {formatResponseTime(answer.responseMs)}
            </li>
          ))}
        </ol>
      )}
    </aside>
  )
}
