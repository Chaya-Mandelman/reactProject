import { type LiveState } from "../../../../types/liveState"

export function Connected({ live }: { live: LiveState }) {
  if (live.participants.length === 0) {
    return <p>עדיין אין משתתפים</p>
  }

  const connectedCount = live.participants.filter((p) => p.connected).length

  return (
    <>
      <h3>מחוברים: {connectedCount} מתוך {live.participants.length}</h3>
      <ul>
        {live.participants.map((participant) => (
          <li key={participant.id}>
            {participant.name} - {participant.connected ? "מחובר" : "לא מחובר"}
          </li>
        ))}
      </ul>
    </>
  )
}