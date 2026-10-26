import { api } from "./apiClient"
import type { Participant, ParticipantInput } from "../types/participant"

type ItemRef = { gameId: number, id: number }

export const addParticipantApi = async ({ gameId, details }: { gameId: number, details: ParticipantInput }): Promise<Participant> => {
  const response = await api.post<{ participant: Participant }>(`/games/${gameId}/participants`, details)
  return response.data.participant
}

export const updateParticipantApi = async ({ gameId, id, details }: ItemRef & { details: ParticipantInput }): Promise<Participant> => {
  const response = await api.patch<{ participant: Participant }>(`/games/${gameId}/participants/${id}`, details)
  return response.data.participant
}

export const deleteParticipantApi = async ({ gameId, id }: ItemRef): Promise<void> => {
  await api.delete(`/games/${gameId}/participants/${id}`)
}
