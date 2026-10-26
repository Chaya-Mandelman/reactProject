import { useAuth } from "./useAuth"

// רק לדפים מוגנים: שם תמיד יש משתמש מחובר
export function useUserId() {
  const { user } = useAuth()
  if (!user) throw new Error("useUserId must be used inside a protected page")
  return user.id
}
