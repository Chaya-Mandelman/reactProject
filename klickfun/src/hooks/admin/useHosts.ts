import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getHostsApi } from "@/api/hosts"
import { queryKeys } from "@/api/queryKeys"
import { useUserId } from "@/hooks/auth/useUserId"
import type { HostsFilters } from "@/types/host"

export function useHosts(filters: HostsFilters = {}) {
  const userId = useUserId()
  return useQuery({
    queryKey: queryKeys.hostsList(userId, filters),
    queryFn: () => getHostsApi(filters),
    placeholderData: keepPreviousData,
  })
}
