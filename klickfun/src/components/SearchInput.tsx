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
    <label>
      {label}
      <input type="search" value={text} onChange={(e) => handleChange(e.target.value)} />
    </label>
  )
}
