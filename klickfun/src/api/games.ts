import { api } from "./apiClient"
import type { Game, GameDetails, GameInput, GamesFilters, GameSummary } from "@/types/game"

export const getMyGamesApi = async (filters: GamesFilters = {}): Promise<GameSummary[]> => {
  const response = await api.get<{ games: GameSummary[] }>("/games", { params: filters })
  return response.data.games
}

export const getGameApi = async (id: number): Promise<GameDetails> => {
  const response = await api.get<{ game: GameDetails }>(`/games/${id}`)
  return response.data.game
}

export const addGameApi = async (details: GameInput): Promise<Game> => {
  const response = await api.post<{ game: Game }>("/games", details)
  return response.data.game
}

export const updateGameApi = async ({ id, details }: { id: number; details: GameInput }): Promise<Game> => {
  const response = await api.patch<{ game: Game }>(`/games/${id}`, details)
  return response.data.game
}

export const duplicateGameApi = async (id: number): Promise<Game> => {
  const response = await api.post<{ game: Game }>(`/games/${id}/duplicate`)
  return response.data.game
}

export const deleteGameApi = async (id: number): Promise<void> => {
  await api.delete(`/games/${id}`)
}
