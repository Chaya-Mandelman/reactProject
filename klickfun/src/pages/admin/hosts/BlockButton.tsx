import { useUpdateHost } from "@/hooks/admin/useHostMutations"
import { getErrorMessage } from "@/utils/getErrorMessage"
import type { Host } from "@/types/host"

// חסימה מבקשת אישור, שחרור לא
export function BlockButton({ host }: { host: Host }) {
  const update = useUpdateHost()
  const block = !host.isBlocked

  const toggle = () => {
    if (block && !confirm(`לחסום את ${host.name}? המנחה לא יוכל להתחבר`)) return
    update.mutate({ id: host.id, details: { isBlocked: block } })
  }

  return (
    <>
      <button className="cursor-pointer rounded-full font-bold transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100 border-2 border-rose-400/70 bg-rose-500/10 px-5 py-2 text-rose-100 shadow-[0_0_12px_rgba(251,113,133,0.35)] hover:bg-rose-500/25 hover:shadow-[0_0_22px_rgba(251,113,133,0.6)]" onClick={toggle} disabled={update.isPending}>
        {update.isPending ? "מעדכן..." : host.isBlocked ? "שחרור חסימה" : "חסימה"}
      </button>
      {update.error && <span className="text-sm font-semibold text-rose-300" role="alert">{getErrorMessage(update.error)}</span>}
    </>
  )
}
