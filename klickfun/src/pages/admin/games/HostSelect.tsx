import { useHosts } from "@/hooks/admin/useHosts"

type Props = {
  value?: number
  onChange: (hostId: number | undefined) => void
}

export function HostSelect({ value, onChange }: Props) {
  const { data: hosts = [] } = useHosts()

  return (
    <select className="mx-1 my-2 inline-flex h-11 align-middle rounded-xl border border-[#A855F7]/25 bg-[#08051F]/60 text-sm text-white outline-none transition duration-200 hover:border-[#A855F7]/45 focus-within:border-[#00E5FF]/70 focus-within:ring-4 focus-within:ring-[#00E5FF]/15 cursor-pointer px-4 focus:border-[#00E5FF]/70 [&>option]:bg-[#140A38]" value={value ?? ""} onChange={(e) => onChange(Number(e.target.value) || undefined)}>
      <option value="">כל המנחים</option>
      {hosts.map((host) => (
        <option key={host.id} value={host.id}>{host.name}</option>
      ))}
    </select>
  )
}
