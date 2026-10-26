import { api } from "./apiClient"
import type { Host, HostInput, HostsFilters, HostUpdate } from "@/types/host"

export const getHostsApi = async ({ search, status }: HostsFilters = {}): Promise<Host[]> => {
  // השרת מצפה ל-blocked=true/false
  const blocked = status && String(status === "blocked")
  const response = await api.get<{ hosts: Host[] }>("/admin/hosts", { params: { search, blocked } })
  return response.data.hosts
}

export const addHostApi = async (details: HostInput): Promise<Host> => {
  const response = await api.post<{ host: Host }>("/admin/hosts", details)
  return response.data.host
}

export const updateHostApi = async ({ id, details }: { id: number; details: HostUpdate }): Promise<Host> => {
  const response = await api.patch<{ host: Host }>(`/admin/hosts/${id}`, details)
  return response.data.host
}
