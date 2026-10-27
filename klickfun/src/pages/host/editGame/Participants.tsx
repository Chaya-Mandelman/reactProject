import { useState } from "react"
import { useAddParticipant } from "@/hooks/participants/useParticipantMutations"
import type { GameDetails } from "@/types/game"
import { ParticipantForm } from "./ParticipantForm"
import { ParticipantRow } from "./ParticipantRow"

export function Participants({ game, locked }: { game: GameDetails; locked: boolean }) {
  const add = useAddParticipant()
  // שינוי ה-key יוצר טופס חדש וריק אחרי כל הוספה
  const [formKey, setFormKey] = useState(0)

  return (
    <section className="card">
      <h2 className="section-title">משתתפים ({game.participants.length})</h2>
      {!locked && (
        <ParticipantForm
          key={formKey}
          submitLabel="הוספת משתתף"
          onSubmit={async (details) => {
            await add.mutateAsync({ gameId: game.id, details })
            setFormKey((key) => key + 1)
          }}
        />
      )}
      {game.participants.length === 0 && <p className="empty mt-4">עדיין אין משתתפים</p>}
      <ul className="mt-4 grid gap-2">
        {game.participants.map((participant) => (
          <ParticipantRow key={participant.id} gameId={game.id} participant={participant} locked={locked} />
        ))}
      </ul>
    </section>
  )
}
