import { useHosts } from "@/hooks/admin/useHosts"
import { getErrorMessage } from "@/utils/getErrorMessage"
import type { HostsFilters } from "@/types/host"
import { HostRow } from "./HostRow"

export function HostsList({ filters }: { filters: HostsFilters }) {
  const { data: hosts, isLoading, error } = useHosts(filters)

  if (isLoading) return <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-20 animate-pulse text-center text-[#C9BCEB]">טוען מנחים...</div>
  // אין נתונים בכלל = הטעינה הראשונה נכשלה. רענון שנכשל משאיר את הרשימה האחרונה
  if (!hosts) return <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 block rounded-2xl border border-rose-400/40 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 shadow-[0_0_24px_-8px_rgba(244,63,94,0.55)] backdrop-blur-md" role="alert">{getErrorMessage(error)}</div>

  return (
    <>
      {error && <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 block rounded-2xl border border-rose-400/40 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 shadow-[0_0_24px_-8px_rgba(244,63,94,0.55)] backdrop-blur-md" role="alert">{getErrorMessage(error)}</div>}
      {hosts.length === 0 ? (
        <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-16 rounded-3xl border border-dashed border-[#A855F7]/30 bg-[#140A38]/40 py-12 text-center text-[#C9BCEB]/75">לא נמצאו מנחים</div>
      ) : (
        <ul className="mx-auto w-[calc(100%-2rem)] max-w-5xl mt-6 mb-16 text-start space-y-3">
          {hosts.map((host) => (
            <HostRow key={host.id} host={host} />
          ))}
        </ul>
      )}
    </>
  )
}
