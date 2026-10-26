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
      <li className="rounded-3xl border-2 border-fuchsia-400/50 bg-indigo-950/70 p-6 shadow-[0_0_30px_rgba(168,85,247,0.35),inset_0_0_30px_rgba(168,85,247,0.15)] backdrop-blur-md !p-4">
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
    <li className="flex flex-wrap items-center gap-3 rounded-2xl border border-violet-400/30 bg-white/5 px-4 py-2.5 transition hover:border-cyan-400/60 hover:bg-white/10 shadow-[0_0_18px_rgba(139,92,246,0.25)]">
      {host.name} · {host.email} · {HOST_STATUS_LABELS[host.isBlocked ? "blocked" : "active"]}
      <Link className="ms-auto font-bold text-cyan-300 underline-offset-4 hover:underline" to={`${paths.adminGames}?hostId=${host.id}`}>משחקים ({host.gamesCount})</Link>
      <button className="cursor-pointer rounded-full font-bold transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100 border-2 border-cyan-400/70 bg-cyan-400/5 px-5 py-2 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.35)] hover:bg-cyan-400/15 hover:shadow-[0_0_22px_rgba(34,211,238,0.6)]" onClick={() => setEditing(true)}>עריכה</button>
      <BlockButton host={host} />
    </li>
  )
}
