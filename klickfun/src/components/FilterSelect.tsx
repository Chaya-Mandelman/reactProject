type Props<T extends string> = {
  labels: Record<T, string>
  value?: T
  allLabel: string
  onChange: (value: T | undefined) => void
}

// בחירה מתוך מילון תוויות, עם אפשרות "הכול" שמנקה את הסינון
export function FilterSelect<T extends string>({ labels, value, allLabel, onChange }: Props<T>) {
  return (
    <select className="mx-1 my-2 inline-flex h-11 align-middle rounded-xl border border-[#A855F7]/25 bg-[#08051F]/60 text-sm text-white outline-none transition duration-200 hover:border-[#A855F7]/45 focus-within:border-[#00E5FF]/70 focus-within:ring-4 focus-within:ring-[#00E5FF]/15 cursor-pointer px-4 focus:border-[#00E5FF]/70 [&>option]:bg-[#140A38]" value={value ?? ""} onChange={(e) => onChange((e.target.value || undefined) as T | undefined)}>
      <option value="">{allLabel}</option>
      {(Object.keys(labels) as T[]).map((key) => (
        <option key={key} value={key}>{labels[key]}</option>
      ))}
    </select>
  )
}
