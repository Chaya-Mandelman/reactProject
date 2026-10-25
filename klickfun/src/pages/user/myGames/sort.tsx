import { useState } from "react"
import { type GamesFilters} from "../../../types/game"
import { useMyGames } from "../../../hooks/games/usegetgames"
import type { GameStatus } from "../../../types/game"   


export function SortGames({ filters, setFilters }: { filters: GamesFilters; setFilters: (filters: GamesFilters) => void }) {
return(
    <>
     <select
        value={filters.status ?? ""}
        onChange={(e) =>
          setFilters({ ...filters, status: (e.target.value || undefined) as GameStatus | undefined })
        }
      >
        <option value="">כל הסטטוסים</option>
        <option value="SETUP">מוגדר</option>
        <option value="ACTIVE">פעיל</option>
        <option value="COMPLETED">הושלם</option>
        <option value="CANCELLED">בוטל</option>
      </select>
      <div>
        <label htmlFor="game-title">חיפוש לפי שם המשחק:</label>
        <input
          id="game-title"
          type="text"
          onChange={(e) => setFilters({ ...filters, search:(e.target.value || undefined) as string | undefined })}
        />
      </div>
      <select
        value={filters.sort ?? ""}
        onChange={(e) =>
          setFilters({ ...filters, sort: (e.target.value || undefined) as "newest" | "oldest" | "title" | undefined })
        }
      >
        <option value="">ללא מיון</option>
        <option value="newest">החדשים ביותר</option>
        <option value="oldest">הישנים ביותר</option>
        <option value="title">לפי שם המשחק</option>
      </select>
      
    </>
)
}