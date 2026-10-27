import { useEffect, useRef, useState } from "react"

type Props = {
  label: string
  value?: string
  onSearch: (value: string | undefined) => void
}

const SEARCH_DELAY_MS = 300

// שולח לשרת רק אחרי שהמשתמשת הפסיקה להקליד
export function SearchInput({ label, value = "", onSearch }: Props) {
  const [text, setText] = useState(value)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // יציאה מהדף מבטלת חיפוש שעוד מחכה
  useEffect(() => () => clearTimeout(timer.current), [])

  const handleChange = (next: string) => {
    setText(next)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => onSearch(next.trim() || undefined), SEARCH_DELAY_MS)
  }

  return (
    <label className="flex h-11 w-full items-center gap-2 rounded-xl border border-white/10 bg-bg/70 ps-4 text-xs font-medium whitespace-nowrap text-muted/70 transition duration-200 hover:border-white/20 focus-within:border-cyan/60 focus-within:ring-4 focus-within:ring-cyan/10 sm:max-w-sm">
      {label}
      <input className="h-full min-w-0 flex-1 bg-transparent pe-4 text-sm text-white outline-none" type="search" value={text} onChange={(e) => handleChange(e.target.value)} />
    </label>
  )
}
