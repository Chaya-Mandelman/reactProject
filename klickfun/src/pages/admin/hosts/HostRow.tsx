import { useState } from "react"
import { Link } from "react-router"
import { paths } from "@/constants/routes"
import { HOST_STATUS_LABELS } from "@/constants/host"
import { useUpdateHost } from "@/hooks/admin/useHostMutations"
import type { Host } from "@/types/host"
import { BlockButton } from "./BlockButton"
import { HostForm } from "./HostForm"

export function HostRow({ host }: { host: Host }) {
  const [editing, setEditing] = useState(false)
  const update = useUpdateHost()

  if (editing) {
    return (
      <li className="rounded-xl border border-gold/30 bg-bg/50 p-4">
        <HostForm
          defaultValues={{ name: host.name, email: host.email }}
          submitLabel="שמירה"
          onCancel={() => setEditing(false)}
          onSubmit={async (details) => {
            await update.mutateAsync({ id: host.id, details })
            setEditing(false)
          }}
        />
      </li>
    )
  }

  return (
    <li className={`row px-5 ${host.isBlocked ? "opacity-60" : ""}`}>
      {host.name} · {host.email} · {HOST_STATUS_LABELS[host.isBlocked ? "blocked" : "active"]}
      <Link className="chip chip-cyan ms-auto transition duration-200 hover:bg-cyan/20" to={`${paths.adminGames}?hostId=${host.id}`}>משחקים ({host.gamesCount})</Link>
      <button className="btn btn-sm btn-ghost" onClick={() => setEditing(true)}>עריכה</button>
      <BlockButton host={host} />
    </li>
  )
}
