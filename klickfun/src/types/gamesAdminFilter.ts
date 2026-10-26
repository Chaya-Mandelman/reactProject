import type { GamesFilters } from "./game"

// במסך הניהול אפשר לסנן גם לפי מנחה
export interface GamesAdminFilters extends GamesFilters {
  hostId?: number
}
