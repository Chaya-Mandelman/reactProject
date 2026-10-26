import { GAME_STATUS_LABELS, GAMES_SORT_LABELS } from "@/constants/game"
import { pick, useUrlFilters } from "@/hooks/useUrlFilters"
import type { GamesFilters, GamesSort, GameStatus } from "@/types/game"

export function useGamesFilters() {
  const { searchParams, updateFilters } = useUrlFilters<GamesFilters>()

  const filters: GamesFilters = {
    search: searchParams.get("search") ?? undefined,
    status: pick<GameStatus>(searchParams.get("status"), GAME_STATUS_LABELS),
    sort: pick<GamesSort>(searchParams.get("sort"), GAMES_SORT_LABELS),
  }

  return { filters, updateFilters }
}
