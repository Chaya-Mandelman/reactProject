import { useState, type ReactNode } from "react"

type Props = {
  label: string
  children: (close: () => void) => ReactNode
}

// כפתור שבלחיצה מתחלף בתוכן (למשל טופס), והתוכן מקבל פונקציה לסגירה
export function OpenButton({ label, children }: Props) {
  const [open, setOpen] = useState(false)

  if (open) return children(() => setOpen(false))
  return <button className="mx-auto my-6 flex w-fit in-[section]:mx-0 in-[section]:mt-0 inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-11 px-6 text-sm bg-linear-to-b from-[#F03CFF] to-[#A855F7] text-white shadow-[0_4px_0_0_#6b1f9e,0_10px_28px_-6px_rgba(240,60,255,0.7)] ring-1 ring-inset ring-white/25 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_6px_0_0_#6b1f9e,0_14px_34px_-4px_rgba(240,60,255,0.9)] active:translate-y-0.5 active:shadow-[0_1px_0_0_#6b1f9e,0_6px_18px_-6px_rgba(240,60,255,0.7)]" onClick={() => setOpen(true)}>{label}</button>
}
