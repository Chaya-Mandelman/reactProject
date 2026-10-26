import { useState } from "react"
import { useDeleteParticipant, useUpdateParticipant } from "../../../hooks/participants/useParticipantMutations"
import { DeleteButton } from "../../../components/DeleteButton"
import type { Participant } from "../../../types/participant"
import { ParticipantForm } from "./ParticipantForm"

type Props = { gameId: number; participant: Participant; locked: boolean }

export function ParticipantRow({ gameId, participant, locked }: Props) {
  const [editing, setEditing] = useState(false)
  const update = useUpdateParticipant()
  const remove = useDeleteParticipant()
  const ref = { gameId, id: participant.id }

  if (editing) {
    return (
      <li>
        <ParticipantForm
          defaultValues={{ name: participant.name, phone: participant.phone }}
          submitLabel="שמירה"
          onCancel={() => setEditing(false)}
          onSubmit={async (details) => {
            await update.mutateAsync({ ...ref, details })
            setEditing(false)
          }}
        />
      </li>
    )
  }

  return (
    <li>
      {participant.name} · {participant.phone}
      <button onClick={() => setEditing(true)} disabled={locked}>עריכה</button>
      <DeleteButton
        confirmText={`למחוק את ${participant.name}?`}
        onConfirm={() => remove.mutate(ref)}
        isPending={remove.isPending}
        error={remove.error}
        disabled={locked}
      />
    </li>
  )
}
