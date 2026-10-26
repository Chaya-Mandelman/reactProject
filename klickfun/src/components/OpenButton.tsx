import { useState, type ReactNode } from "react"

type Props = {
  label: string
  children: (close: () => void) => ReactNode
}

// כפתור שבלחיצה מתחלף בתוכן (למשל טופס), והתוכן מקבל פונקציה לסגירה
export function OpenButton({ label, children }: Props) {
  const [open, setOpen] = useState(false)

  if (open) return children(() => setOpen(false))
  return <button className="mx-auto my-4 block cursor-pointer rounded-full font-bold transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100 border border-fuchsia-300/50 bg-linear-to-l from-fuchsia-600 via-purple-600 to-violet-600 px-6 py-2.5 text-white shadow-[0_0_20px_rgba(217,70,239,0.55)] hover:scale-105 hover:shadow-[0_0_32px_rgba(217,70,239,0.85)]" onClick={() => setOpen(true)}>{label}</button>
}
