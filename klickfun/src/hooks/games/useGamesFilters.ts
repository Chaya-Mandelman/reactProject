import { useSearchParams } from "react-router"
import type { GamesFilters, GamesSort, GameStatus } from "../../types/game"

// הפילטרים נשמרים בכתובת, כך שהם נשארים אחרי רענון או חזרה מדף אחר
export function useGamesFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: GamesFilters = {
    search: searchParams.get("search") ?? undefined,
    status: (searchParams.get("status") as GameStatus | null) ?? undefined,
    sort: (searchParams.get("sort") as GamesSort | null) ?? undefined,
  }

  const updateFilters = (changes: GamesFilters) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      for (const [key, value] of Object.entries(changes)) {
        if (value) next.set(key, value)
        else next.delete(key)
      }
      return next
    }, { replace: true })
  }

  return { filters, updateFilters }
}
