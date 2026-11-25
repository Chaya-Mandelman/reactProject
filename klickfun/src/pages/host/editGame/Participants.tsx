import { useState } from "react"
import { useAddParticipant } from "@/hooks/participants/useParticipantMutations"
import { OpenButton } from "@/components/OpenButton"
import { useAiEnabled } from "@/hooks/ai/useAiStatus"
import type { GameDetails } from "@/types/game"
import { AiParticipants } from "./AiParticipants"
import { ParticipantForm } from "./ParticipantForm"
import { ParticipantRow } from "./ParticipantRow"

export function Participants({ game, locked }: { game: GameDetails; locked: boolean }) {
  const add = useAddParticipant()
  // שינוי ה-key יוצר טופס חדש וריק אחרי כל הוספה
  const [formKey, setFormKey] = useState(0)
  const aiEnabled = useAiEnabled()

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
      {!locked && aiEnabled && (
        <div className="mt-3">
          <OpenButton label="✨ הדבקה חכמה של רשימה">
            {(close) => <AiParticipants gameId={game.id} onClose={close} />}
          </OpenButton>
        </div>
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
