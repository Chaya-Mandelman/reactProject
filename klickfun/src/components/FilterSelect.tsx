type Props<T extends string> = {
  labels: Record<T, string>
  value?: T
  allLabel: string
  onChange: (value: T | undefined) => void
}

// בחירה מתוך מילון תוויות, עם אפשרות "הכול" שמנקה את הסינון
export function FilterSelect<T extends string>({ labels, value, allLabel, onChange }: Props<T>) {
  return (
    <select className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-3 block cursor-pointer rounded-xl border-2 border-violet-400/40 bg-indigo-950/70 px-4 py-2.5 text-white placeholder:text-violet-300/50 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_16px_rgba(34,211,238,0.45)] [&>option]:bg-indigo-950" value={value ?? ""} onChange={(e) => onChange((e.target.value || undefined) as T | undefined)}>
      <option value="">{allLabel}</option>
      {(Object.keys(labels) as T[]).map((key) => (
        <option key={key} value={key}>{labels[key]}</option>
      ))}
    </select>
  )
}
