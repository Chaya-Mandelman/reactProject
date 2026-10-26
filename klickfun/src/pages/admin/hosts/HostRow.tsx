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
      <li className="rounded-3xl border border-[#A855F7]/30 bg-linear-to-b from-[#21104D]/90 to-[#140A38]/90 text-start shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9),0_0_40px_-22px_rgba(168,85,247,0.7)] ring-1 ring-inset ring-white/5 backdrop-blur-xl p-4">
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
    <li className="flex flex-wrap items-center gap-3 px-5 py-3 text-sm rounded-2xl border border-[#A855F7]/20 bg-[#21104D]/50 transition duration-200 hover:border-[#A855F7]/45 hover:bg-[#21104D]/80">
      {host.name} · {host.email} · {HOST_STATUS_LABELS[host.isBlocked ? "blocked" : "active"]}
      <Link className="ms-auto rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset bg-[#00E5FF]/10 text-[#7DF3FF] ring-[#00E5FF]/35 transition hover:bg-[#00E5FF]/20" to={`${paths.adminGames}?hostId=${host.id}`}>משחקים ({host.gamesCount})</Link>
      <button className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-8 px-3.5 text-xs border border-[#00E5FF]/30 bg-[#140A38]/80 text-[#C9BCEB] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[#00E5FF]/70 hover:bg-[#00E5FF]/10 hover:text-white hover:shadow-[0_0_18px_-4px_rgba(0,229,255,0.6)]" onClick={() => setEditing(true)}>עריכה</button>
      <BlockButton host={host} />
    </li>
  )
}
