import { addParticipantApi, deleteParticipantApi, updateParticipantApi } from "../../api/participants"
import { useGameMutation } from "../games/useGameMutation"

export const useAddParticipant = () => useGameMutation(addParticipantApi)
export const useUpdateParticipant = () => useGameMutation(updateParticipantApi)
export const useDeleteParticipant = () => useGameMutation(deleteParticipantApi)
