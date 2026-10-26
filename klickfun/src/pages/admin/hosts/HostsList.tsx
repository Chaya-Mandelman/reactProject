import { useHosts } from "@/hooks/admin/useHosts"
import { getErrorMessage } from "@/utils/getErrorMessage"
import type { HostsFilters } from "@/types/host"
import { HostRow } from "./HostRow"

export function HostsList({ filters }: { filters: HostsFilters }) {
  const { data: hosts, isLoading, error } = useHosts(filters)

  if (isLoading) return <div>טוען מנחים...</div>
  // אין נתונים בכלל = הטעינה הראשונה נכשלה. רענון שנכשל משאיר את הרשימה האחרונה
  if (!hosts) return <div role="alert">{getErrorMessage(error)}</div>

  return (
    <>
      {error && <div role="alert">{getErrorMessage(error)}</div>}
      {hosts.length === 0 ? (
        <div>לא נמצאו מנחים</div>
      ) : (
        <ul>
          {hosts.map((host) => (
            <HostRow key={host.id} host={host} />
          ))}
        </ul>
      )}
    </>
  )
}
