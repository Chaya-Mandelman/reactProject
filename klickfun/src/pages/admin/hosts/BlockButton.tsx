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
      <button className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-8 px-3.5 text-xs border border-rose-400/35 bg-rose-500/10 text-rose-200 hover:border-rose-400/80 hover:bg-rose-500/20 hover:text-white hover:shadow-[0_0_18px_-4px_rgba(244,63,94,0.6)]" onClick={toggle} disabled={update.isPending}>
        {update.isPending ? "מעדכן..." : host.isBlocked ? "שחרור חסימה" : "חסימה"}
      </button>
      {update.error && <span className="text-xs font-semibold text-rose-300" role="alert">{getErrorMessage(update.error)}</span>}
    </>
  )
}
