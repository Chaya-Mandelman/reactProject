import { useEffect, useState } from "react"
import type { GamesFilters, GamesSort, GameStatus } from "../../../types/game"

type Props = {
  filters: GamesFilters
  onChange: (changes: GamesFilters) => void
}

export function SortGames({ filters, onChange }: Props) {
  const [search, setSearch] = useState(filters.search ?? "")

  // שולחים לשרת רק אחרי שהמשתמשת הפסיקה להקליד
  useEffect(() => {
    const timer = setTimeout(() => onChange({ search: search.trim() || undefined }), 300)
    return () => clearTimeout(timer)
    // onChange נוצרת מחדש בכל רינדור; אם היא בתלויות, הטיימר ירוץ שוב ושוב
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  return (
    <>
      <div>
        <label htmlFor="game-title">חיפוש לפי שם המשחק:</label>
        <input
          id="game-title"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <select
        value={filters.status ?? ""}
        onChange={(e) => onChange({ status: (e.target.value || undefined) as GameStatus | undefined })}
      >
        <option value="">כל הסטטוסים</option>
        <option value="SETUP">בהכנה</option>
        <option value="LOBBY">בהמתנה</option>
        <option value="RUNNING">פעיל</option>
        <option value="PAUSED">מושהה</option>
        <option value="FINISHED">הסתיים</option>
      </select>
      <select
        value={filters.sort ?? ""}
        onChange={(e) => onChange({ sort: (e.target.value || undefined) as GamesSort | undefined })}
      >
        <option value="">החדשים ביותר</option>
        <option value="oldest">הישנים ביותר</option>
        <option value="title">לפי שם המשחק</option>
      </select>
    </>
  )
}
