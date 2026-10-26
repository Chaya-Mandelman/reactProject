import { useState } from "react"
import { useDeleteParticipant, useUpdateParticipant } from "@/hooks/participants/useParticipantMutations"
import { DeleteButton } from "@/components/DeleteButton"
import type { Participant } from "@/types/participant"
import { ParticipantForm } from "./ParticipantForm"

type Props = { gameId: number; participant: Participant; locked: boolean }

export function ParticipantRow({ gameId, participant, locked }: Props) {
  const [editing, setEditing] = useState(false)
  const update = useUpdateParticipant()
  const remove = useDeleteParticipant()
  const ref = { gameId, id: participant.id }

  if (editing) {
    return (
      <li className="rounded-2xl bg-white/5 p-3">
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
    <li className="flex flex-wrap items-center gap-3 rounded-2xl border border-violet-400/30 bg-white/5 px-4 py-2.5 transition hover:border-cyan-400/60 hover:bg-white/10">
      {participant.name} · {participant.phone}
      <button className="ms-auto cursor-pointer rounded-full font-bold transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100 border-2 border-cyan-400/70 bg-cyan-400/5 px-5 py-2 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.35)] hover:bg-cyan-400/15 hover:shadow-[0_0_22px_rgba(34,211,238,0.6)]" onClick={() => setEditing(true)} disabled={locked}>עריכה</button>
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
