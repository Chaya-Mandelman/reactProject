import { useEffect, useState } from "react"

// מספר שרץ מ-from עד to (למשל ניקוד שעולה), אחרי השהיה קצרה
export function useCountUp(to: number, from = 0, durationMs = 1200, delayMs = 0) {
  const [value, setValue] = useState(from)

  useEffect(() => {
    let frame = 0
    let start: number | null = null
    const step = (now: number) => {
      start ??= now + delayMs
      const progress = Math.min(1, Math.max(0, (now - start) / durationMs))
      // מאט לקראת הסוף
      const eased = 1 - (1 - progress) ** 3
      setValue(Math.round(from + (to - from) * eased))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [to, from, durationMs, delayMs])

  return value
}
