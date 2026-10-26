type Props<T extends string> = {
  labels: Record<T, string>
  value?: T
  allLabel: string
  onChange: (value: T | undefined) => void
}

// בחירה מתוך מילון תוויות, עם אפשרות "הכול" שמנקה את הסינון
export function FilterSelect<T extends string>({ labels, value, allLabel, onChange }: Props<T>) {
  return (
    <select value={value ?? ""} onChange={(e) => onChange((e.target.value || undefined) as T | undefined)}>
      <option value="">{allLabel}</option>
      {(Object.keys(labels) as T[]).map((key) => (
        <option key={key} value={key}>{labels[key]}</option>
      ))}
    </select>
  )
}
