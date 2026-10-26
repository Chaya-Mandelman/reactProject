import { FilterSelect } from "@/components/FilterSelect"
import { SearchInput } from "@/components/SearchInput"
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
        labels={GAME_STATUS_LABELS}
        value={filters.status}
        allLabel="כל הסטטוסים"
        onChange={(status) => onChange({ status })}
      />
      {/* מיון ברירת המחדל לא נשמר בכתובת */}
      <select className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-3 block cursor-pointer rounded-xl border-2 border-violet-400/40 bg-indigo-950/70 px-4 py-2.5 text-white placeholder:text-violet-300/50 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_16px_rgba(34,211,238,0.45)] [&>option]:bg-indigo-950"
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
    </>
  )
}
