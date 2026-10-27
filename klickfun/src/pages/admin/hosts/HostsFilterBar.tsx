import { FilterSelect } from "@/components/FilterSelect"
import { SearchInput } from "@/components/SearchInput"
import { HOST_STATUS_LABELS } from "@/constants/host"
import type { HostsFilters } from "@/types/host"

type Props = {
  filters: HostsFilters
  onChange: (changes: HostsFilters) => void
}

export function HostsFilterBar({ filters, onChange }: Props) {
  return (
    <>
      <SearchInput label="חיפוש לפי שם או אימייל:" value={filters.search} onSearch={(search) => onChange({ search })} />
      <FilterSelect
        label="סינון לפי סטטוס:"
        labels={HOST_STATUS_LABELS}
        value={filters.status}
        allLabel="כל המנחים"
        onChange={(status) => onChange({ status })}
      />
    </>
  )
}
