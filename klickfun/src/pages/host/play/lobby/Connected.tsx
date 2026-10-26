import type { LiveState } from "@/types/liveState"

export function Connected({ live }: { live: LiveState }) {
  if (live.participants.length === 0) return <p className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-16 rounded-3xl border border-dashed border-[#A855F7]/30 bg-[#140A38]/40 py-12 text-center text-[#C9BCEB]/75">עדיין אין משתתפים</p>

  return (
    <>
      <h3 className="mb-6 inline-block rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset bg-[#00E5FF]/10 px-5 py-2 text-base font-bold tabular-nums text-[#7DF3FF] ring-[#00E5FF]/40 shadow-[0_0_20px_-6px_rgba(0,229,255,0.7)]">מחוברים: {live.connectedCount} מתוך {live.participants.length}</h3>
      <ul className="mx-auto mb-12 flex max-w-4xl flex-wrap justify-center gap-3">
        {live.participants.map((participant) => (
          <li
            className={`rounded-full border px-5 py-2 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 ${participant.connected
              ? "border-emerald-400/60 bg-emerald-500/15 shadow-[0_0_18px_-4px_rgba(34,197,94,0.7)] hover:border-emerald-300"
              : "border-[#F03CFF]/40 bg-[#F03CFF]/10 shadow-[0_0_18px_-4px_rgba(240,60,255,0.6)] hover:border-[#F03CFF]/80"}`}
            key={participant.id}
          >
            {participant.name} - {participant.connected ? "מחובר" : "לא מחובר"}
          </li>
        ))}
      </ul>
    </>
  )
}
