import { api } from "./apiClient"
import type { GameItemRef } from "@/types/game"
import type { Participant, ParticipantInput } from "@/types/participant"

export const addParticipantApi = async ({ gameId, details }: { gameId: number; details: ParticipantInput }): Promise<Participant> => {
  const response = await api.post<{ participant: Participant }>(`/games/${gameId}/participants`, details)
  return response.data.participant
}

// הוספת הרבה משתתפים בבת אחת: או שכולם נשמרים או אף אחד
export const addParticipantsBulkApi = async ({ gameId, participants }: { gameId: number; participants: ParticipantInput[] }): Promise<Participant[]> => {
  const response = await api.post<{ participants: Participant[] }>(`/games/${gameId}/participants/bulk`, { participants })
  return response.data.participants
}

export const updateParticipantApi = async ({ gameId, id, details }: GameItemRef & { details: ParticipantInput }): Promise<Participant> => {
  const response = await api.patch<{ participant: Participant }>(`/games/${gameId}/participants/${id}`, details)
  return response.data.participant
}

export const deleteParticipantApi = async ({ gameId, id }: GameItemRef): Promise<void> => {
  await api.delete(`/games/${gameId}/participants/${id}`)
}
