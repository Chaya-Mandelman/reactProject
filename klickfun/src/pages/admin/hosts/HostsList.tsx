import { useHosts } from "@/hooks/admin/useHosts"
import { getErrorMessage } from "@/utils/getErrorMessage"
import type { HostsFilters } from "@/types/host"
import { HostRow } from "./HostRow"

export function HostsList({ filters }: { filters: HostsFilters }) {
  const { data: hosts, isLoading, error } = useHosts(filters)

  if (isLoading) return <div className="status">טוען מנחים...</div>
  // אין נתונים בכלל = הטעינה הראשונה נכשלה. רענון שנכשל משאיר את הרשימה האחרונה
  if (!hosts) return <div className="alert" role="alert">{getErrorMessage(error)}</div>

  return (
    <>
      {error && <div className="alert mb-6" role="alert">{getErrorMessage(error)}</div>}
      {hosts.length === 0 ? (
        <div className="empty">לא נמצאו מנחים</div>
      ) : (
        <ul className="space-y-3 text-start">
          {hosts.map((host) => (
            <HostRow key={host.id} host={host} />
          ))}
        </ul>
      )}
    </>
  )
}
