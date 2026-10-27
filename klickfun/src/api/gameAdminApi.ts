import { api } from "./apiClient"
import type { GameSummary } from "@/types/game"
import type { GamesAdminFilters } from "@/types/gamesAdminFilter"

// כל המשחקים של כל המנחים. צפייה ומחיקה משתמשות ב-getGameApi וב-deleteGameApi הרגילים
export const getAdminGamesApi = async (filters: GamesAdminFilters): Promise<GameSummary[]> => {
  const response = await api.get<{ games: GameSummary[] }>("/admin/games", { params: filters })
  return response.data.games
}
