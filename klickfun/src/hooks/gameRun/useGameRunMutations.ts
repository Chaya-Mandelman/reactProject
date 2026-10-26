import { openLobbyApi, pauseGameApi, resumeGameApi, startGameApi, stopGameApi } from "@/api/gameRun"
import { useLiveMutation } from "./useLiveMutation"

export const useOpenLobby = () => useLiveMutation(openLobbyApi)
export const useStartGame = () => useLiveMutation(startGameApi)
export const usePauseGame = () => useLiveMutation(pauseGameApi)
export const useResumeGame = () => useLiveMutation(resumeGameApi)
export const useStopGame = () => useLiveMutation(stopGameApi)
