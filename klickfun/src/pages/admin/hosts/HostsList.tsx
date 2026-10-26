import { useHosts } from "@/hooks/admin/useHosts"
import { getErrorMessage } from "@/utils/getErrorMessage"
import type { HostsFilters } from "@/types/host"
import { HostRow } from "./HostRow"

export function HostsList({ filters }: { filters: HostsFilters }) {
  const { data: hosts, isLoading, error } = useHosts(filters)

  if (isLoading) return <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-16 animate-pulse text-center text-lg text-violet-200">טוען מנחים...</div>
  // אין נתונים בכלל = הטעינה הראשונה נכשלה. רענון שנכשל משאיר את הרשימה האחרונה
  if (!hosts) return <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 rounded-xl border border-rose-400/60 bg-rose-500/15 px-4 py-2 font-semibold text-rose-200" role="alert">{getErrorMessage(error)}</div>

  return (
    <>
      {error && <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 rounded-xl border border-rose-400/60 bg-rose-500/15 px-4 py-2 font-semibold text-rose-200" role="alert">{getErrorMessage(error)}</div>}
      {hosts.length === 0 ? (
        <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-12 text-center text-lg text-violet-300/80">לא נמצאו מנחים</div>
      ) : (
        <ul className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-6 space-y-3">
          {hosts.map((host) => (
            <HostRow key={host.id} host={host} />
          ))}
        </ul>
      )}
    </>
  )
}
