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
      <li className="col-span-full rounded-2xl bg-[#08051F]/40 p-3">
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
    <li className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/90 rounded-2xl border border-[#A855F7]/20 bg-[#21104D]/50 transition duration-200 hover:border-[#A855F7]/45 hover:bg-[#21104D]/80">
      {participant.name} · {participant.phone}
      <button className="ms-auto inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-8 px-3.5 text-xs border border-[#00E5FF]/30 bg-[#140A38]/80 text-[#C9BCEB] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[#00E5FF]/70 hover:bg-[#00E5FF]/10 hover:text-white hover:shadow-[0_0_18px_-4px_rgba(0,229,255,0.6)]" onClick={() => setEditing(true)} disabled={locked}>עריכה</button>
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
