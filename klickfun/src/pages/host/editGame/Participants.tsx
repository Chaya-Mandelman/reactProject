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
    <section className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-6 block rounded-3xl border border-[#A855F7]/30 bg-linear-to-b from-[#21104D]/90 to-[#140A38]/90 p-5 sm:p-6 text-start shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9),0_0_40px_-22px_rgba(168,85,247,0.7)] ring-1 ring-inset ring-white/5 backdrop-blur-xl">
      <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-white before:h-6 before:w-1.5 before:rounded-full before:bg-linear-to-b before:from-[#F03CFF] before:to-[#00E5FF] before:shadow-[0_0_10px_rgba(240,60,255,0.7)]">משתתפים ({game.participants.length})</h2>
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
      {game.participants.length === 0 && <p className="mt-5 rounded-2xl border border-dashed border-[#A855F7]/30 bg-[#140A38]/40 py-8 text-center text-sm text-[#C9BCEB]/75">עדיין אין משתתפים</p>}
      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {game.participants.map((participant) => (
          <ParticipantRow key={participant.id} gameId={game.id} participant={participant} locked={locked} />
        ))}
      </ul>
    </section>
  )
}
