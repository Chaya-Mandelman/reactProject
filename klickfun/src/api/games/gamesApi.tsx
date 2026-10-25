import { api } from "../apiClients"
import type { CreateGame, Game,  GamesFilters,  GameSummary } from "../../types/game"



export const getMyGames = async (filters: GamesFilters = {}): Promise<GameSummary[]> => {
  const response = await api.get<{ games: GameSummary[] }>("/games", { params: filters })
  return response.data.games
}

export const addGameApi = async (details: CreateGame): Promise<Game> => {
  const response = await api.post<{ game: Game }>("/games", details)
  return response.data.game
}

export const duplicateGameApi=async (id: string): Promise<Game> => {
    const response = await api.post<{ game: Game }>(`/api/games/${id}/duplicate`)
    return response.data.game
}
    
export const deleteGameApi = async (id: string): Promise<void> => {
  await api.delete(`/games/${id}`)
}

