import { useSearchParams } from "react-router"

// ערך מהכתובת נשמר רק אם הוא אחד המפתחות המוכרים
export const pick = <T extends string>(value: string | null, allowed: Record<T, string>): T | undefined =>
  value !== null && value in allowed ? (value as T) : undefined

// הפילטרים נשמרים בכתובת, כך שהם נשארים אחרי רענון או חזרה מדף אחר
export function useUrlFilters<T extends object>() {
  const [searchParams, setSearchParams] = useSearchParams()

  const updateFilters = (changes: Partial<T>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      for (const [key, value] of Object.entries(changes)) {
        if (value) next.set(key, String(value))
        else next.delete(key)
      }
      return next
    }, { replace: true })
  }

  return { searchParams, updateFilters }
}
