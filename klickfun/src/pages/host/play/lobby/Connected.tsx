import type { LiveState } from "@/types/liveState"

export function Connected({ live }: { live: LiveState }) {
  if (live.participants.length === 0) return <p className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-12 text-center text-lg text-violet-300/80">עדיין אין משתתפים</p>

  return (
    <>
      <h3 className="mb-5 text-center text-xl font-bold text-cyan-200">מחוברים: {live.connectedCount} מתוך {live.participants.length}</h3>
      <ul className="mb-10 flex flex-wrap justify-center gap-3">
        {live.participants.map((participant) => (
          <li className="rounded-full border-2 border-fuchsia-400/60 bg-indigo-950/70 px-5 py-2 font-semibold shadow-[0_0_14px_rgba(217,70,239,0.35)]" key={participant.id}>
            {participant.name} - {participant.connected ? "מחובר" : "לא מחובר"}
          </li>
        ))}
      </ul>
    </>
  )
}
