import { useHosts } from "@/hooks/admin/useHosts"

type Props = {
  value?: number
  onChange: (hostId: number | undefined) => void
}

export function HostSelect({ value, onChange }: Props) {
  const { data: hosts = [] } = useHosts()

  return (
    <select className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-3 block cursor-pointer rounded-xl border-2 border-violet-400/40 bg-indigo-950/70 px-4 py-2.5 text-white placeholder:text-violet-300/50 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_16px_rgba(34,211,238,0.45)] [&>option]:bg-indigo-950" value={value ?? ""} onChange={(e) => onChange(Number(e.target.value) || undefined)}>
      <option value="">כל המנחים</option>
      {hosts.map((host) => (
        <option key={host.id} value={host.id}>{host.name}</option>
      ))}
    </select>
  )
}
