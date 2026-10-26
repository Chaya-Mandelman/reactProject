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
    <label className="mx-1 my-2 inline-flex h-11 align-middle rounded-xl border border-[#A855F7]/25 bg-[#08051F]/60 text-sm text-white outline-none transition duration-200 hover:border-[#A855F7]/45 focus-within:border-[#00E5FF]/70 focus-within:ring-4 focus-within:ring-[#00E5FF]/15 w-[calc(100%-0.5rem)] max-w-sm items-center gap-2 ps-4 text-xs font-medium text-[#C9BCEB]/60">
      {label}
      <input className="h-full min-w-0 flex-1 bg-transparent pe-4 text-sm text-white outline-none" type="search" value={text} onChange={(e) => handleChange(e.target.value)} />
    </label>
  )
}
