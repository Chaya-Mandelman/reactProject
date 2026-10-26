import { useState, type ReactNode } from "react"

// כפתור שבלחיצה מתחלף בתוכן (למשל טופס), והתוכן מקבל פונקציה לסגירה
export function OpenButton({ label, children }: { label: string; children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false)

  if (open) return children(() => setOpen(false))
  return <button onClick={() => setOpen(true)}>{label}</button>
}
