import { useGamesFilters } from "@/hooks/games/useGamesFilters"
import { useUrlFilters } from "@/hooks/useUrlFilters"
import type { GamesAdminFilters } from "@/types/gamesAdminFilter"

// הפילטרים של המשחקים, ובנוסף סינון לפי מנחה
export function useAdminGamesFilters() {
  const { filters } = useGamesFilters()
  const { searchParams, updateFilters } = useUrlFilters<GamesAdminFilters>()

  const adminFilters: GamesAdminFilters = { ...filters, hostId: Number(searchParams.get("hostId")) || undefined }
  return { filters: adminFilters, updateFilters }
}
