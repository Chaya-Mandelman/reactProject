import { FilterSelect } from "./FilterSelect"
import { SearchInput } from "./SearchInput"
import { GAME_STATUS_LABELS, GAMES_SORT_LABELS } from "@/constants/game"
import type { GamesFilters, GamesSort } from "@/types/game"

type Props = {
  filters: GamesFilters
  onChange: (changes: GamesFilters) => void
}

const SORTS = Object.keys(GAMES_SORT_LABELS) as GamesSort[]
const DEFAULT_SORT: GamesSort = "newest"

export function GamesFilterBar({ filters, onChange }: Props) {
  return (
    <>
      <SearchInput label="חיפוש לפי שם המשחק:" value={filters.search} onSearch={(search) => onChange({ search })} />
      <FilterSelect
        label="סינון לפי סטטוס:"
        labels={GAME_STATUS_LABELS}
        value={filters.status}
        allLabel="כל הסטטוסים"
        onChange={(status) => onChange({ status })}
      />
      {/* מיון ברירת המחדל לא נשמר בכתובת */}
      <label className="filter-label">
        מיון לפי:
        <select className="select"
          value={filters.sort ?? DEFAULT_SORT}
          onChange={(e) => {
            const sort = e.target.value as GamesSort
            onChange({ sort: sort === DEFAULT_SORT ? undefined : sort })
          }}
        >
          {SORTS.map((sort) => (
            <option key={sort} value={sort}>{GAMES_SORT_LABELS[sort]}</option>
          ))}
        </select>
      </label>
    </>
  )
}
