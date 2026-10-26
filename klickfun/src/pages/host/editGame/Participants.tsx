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
    <section className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-8 rounded-3xl border-2 border-fuchsia-400/50 bg-indigo-950/70 p-6 shadow-[0_0_30px_rgba(168,85,247,0.35),inset_0_0_30px_rgba(168,85,247,0.15)] backdrop-blur-md">
      <h2 className="mb-5 text-2xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]">משתתפים ({game.participants.length})</h2>
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
      {game.participants.length === 0 && <p className="my-4 text-violet-300/80">עדיין אין משתתפים</p>}
      <ul className="mt-4 space-y-2">
        {game.participants.map((participant) => (
          <ParticipantRow key={participant.id} gameId={game.id} participant={participant} locked={locked} />
        ))}
      </ul>
    </section>
  )
}
