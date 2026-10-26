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
    <label className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-3 flex flex-wrap items-center gap-3 font-semibold text-violet-200">
      {label}
      <input className="min-w-48 flex-1 rounded-xl border-2 border-violet-400/40 bg-indigo-950/70 px-4 py-2.5 text-white placeholder:text-violet-300/50 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_16px_rgba(34,211,238,0.45)]" type="search" value={text} onChange={(e) => handleChange(e.target.value)} />
    </label>
  )
}
