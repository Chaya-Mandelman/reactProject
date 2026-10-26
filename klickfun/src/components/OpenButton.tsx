import { useState, type ReactNode } from "react"

type Props = {
  label: string
  children: (close: () => void) => ReactNode
}

// כפתור שבלחיצה מתחלף בתוכן (למשל טופס), והתוכן מקבל פונקציה לסגירה
export function OpenButton({ label, children }: Props) {
  const [open, setOpen] = useState(false)

  if (open) return children(() => setOpen(false))
  return <button onClick={() => setOpen(true)}>{label}</button>
}
