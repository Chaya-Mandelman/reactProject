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
      <select className="mx-1 my-2 inline-flex h-11 align-middle rounded-xl border border-[#A855F7]/25 bg-[#08051F]/60 text-sm text-white outline-none transition duration-200 hover:border-[#A855F7]/45 focus-within:border-[#00E5FF]/70 focus-within:ring-4 focus-within:ring-[#00E5FF]/15 cursor-pointer px-4 focus:border-[#00E5FF]/70 [&>option]:bg-[#140A38]"
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
