import { HOST_STATUS_LABELS } from "@/constants/host"
import { pick, useUrlFilters } from "@/hooks/useUrlFilters"
import type { HostsFilters, HostStatus } from "@/types/host"

export function useHostsFilters() {
  const { searchParams, updateFilters } = useUrlFilters<HostsFilters>()

  const filters: HostsFilters = {
    search: searchParams.get("search") ?? undefined,
    status: pick<HostStatus>(searchParams.get("status"), HOST_STATUS_LABELS),
  }

  return { filters, updateFilters }
}
