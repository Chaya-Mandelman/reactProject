import type { GamesFilters } from "@/types/game"
import type { GamesAdminFilters } from "@/types/gamesAdminFilter"
import type { HostsFilters } from "@/types/host"

// כל מפתח כולל את המשתמש המחובר, כך שלכל משתמש יש cache משלו.
// מפתחות המשחקים מתחילים ב-["games", userId], כך ש-invalidate של games מרענן את כולם
export const queryKeys = {
  games: (userId: number) => ["games", userId] as const,
  gamesList: (userId: number, filters: GamesFilters) => ["games", userId, "list", filters] as const,
  adminGamesList: (userId: number, filters: GamesAdminFilters) => ["games", userId, "admin", filters] as const,
  game: (userId: number, id: number) => ["games", userId, "detail", id] as const,
  live: (userId: number, id: number) => ["live", userId, id] as const,
  hosts: (userId: number) => ["hosts", userId] as const,
  hostsList: (userId: number, filters: HostsFilters) => ["hosts", userId, "list", filters] as const,
}
