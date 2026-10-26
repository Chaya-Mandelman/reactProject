import { useHosts } from "@/hooks/admin/useHosts"

type Props = {
  value?: number
  onChange: (hostId: number | undefined) => void
}

export function HostSelect({ value, onChange }: Props) {
  const { data: hosts = [] } = useHosts()

  return (
    <select value={value ?? ""} onChange={(e) => onChange(Number(e.target.value) || undefined)}>
      <option value="">כל המנחים</option>
      {hosts.map((host) => (
        <option key={host.id} value={host.id}>{host.name}</option>
      ))}
    </select>
  )
}
