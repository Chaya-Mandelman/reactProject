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
      <button onClick={toggle} disabled={update.isPending}>
        {update.isPending ? "מעדכן..." : host.isBlocked ? "שחרור חסימה" : "חסימה"}
      </button>
      {update.error && <span role="alert">{getErrorMessage(update.error)}</span>}
    </>
  )
}
