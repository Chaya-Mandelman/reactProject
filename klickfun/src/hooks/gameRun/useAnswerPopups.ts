import { useEffect, useRef, useState } from "react"
import type { RecentAnswer } from "@/types/liveState"

// מוסיף לרשימה כל תשובה שעוד לא הוצגה. remove מוריד שם אחרי שהוצג.
// הבדיקה לפי answerId חשובה: תשובה של השהיה/המשך מחזירה את כל התשובות מחדש
export function useAnswerPopups(answers: RecentAnswer[]) {
  const [popups, setPopups] = useState<RecentAnswer[]>([])
  const lastShownId = useRef(0)

  useEffect(() => {
    const fresh = answers.filter((answer) => answer.answerId > lastShownId.current)
    if (fresh.length === 0) return
    lastShownId.current = fresh[fresh.length - 1].answerId
    setPopups((prev) => [...prev, ...fresh])
  }, [answers])

  const remove = (answerId: number) => {
    setPopups((prev) => prev.filter((answer) => answer.answerId !== answerId))
  }

  return { popups, remove }
}
