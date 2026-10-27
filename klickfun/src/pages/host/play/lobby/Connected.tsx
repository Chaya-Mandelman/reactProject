import type { LiveState } from "@/types/liveState"

export function Connected({ live }: { live: LiveState }) {
  if (live.participants.length === 0) return <p className="empty my-12 w-full">עדיין אין משתתפים</p>

  return (
    <>
      <div className="frame-hex mt-8 w-full max-w-2xl px-16 py-7 [border-image-width:56px]">
        <h3 className="text-2xl font-black text-ok tabular-nums drop-shadow-[0_0_14px_rgb(56_226_122/0.6)] sm:text-4xl">מחוברים: {live.connectedCount} מתוך {live.participants.length}</h3>
      </div>
      <ul className="frame-panel mt-10 mb-10 grid w-full max-w-3xl grid-cols-3 gap-x-4 gap-y-6 px-8 py-9 sm:grid-cols-5">
        {live.participants.map((participant) => (
          <li className={`avatar transition duration-300 motion-reduce:transition-none ${participant.connected ? "text-ok" : "text-muted/40"}`} key={participant.id}>
            <span className="break-words text-white">{participant.name}</span>
            <span className="sr-only"> - {participant.connected ? "מחובר" : "לא מחובר"}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
