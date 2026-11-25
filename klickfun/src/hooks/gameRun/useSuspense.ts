import { useEffect, useState } from "react"

// רגע מתח: false בהתחלה, ואחרי durationMs הופך ל-true.
// onStart ו-onReveal רצים פעם אחת (בתוך טיימר, כדי שהרצה כפולה של React בפיתוח לא תשמיע צליל פעמיים)
export function useSuspense(durationMs: number, onStart?: () => void, onReveal?: () => void) {
  const [revealed, setRevealed] = useState(durationMs <= 0)

  useEffect(() => {
    if (durationMs <= 0) return
    const start = setTimeout(() => onStart?.(), 0)
    const end = setTimeout(() => {
      setRevealed(true)
      onReveal?.()
    }, durationMs)
    return () => {
      clearTimeout(start)
      clearTimeout(end)
    }
    // רק פעם אחת בכל הצגה של המסך
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return revealed
}
