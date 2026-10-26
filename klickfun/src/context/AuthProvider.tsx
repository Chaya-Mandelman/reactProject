import { useEffect, useState, type ReactNode } from "react"
import { isAxiosError } from "axios"
import { getCurrentUserApi } from "@/api/auth"
import type { AuthUser } from "@/types/auth"
import { tokenStorage } from "@/utils/tokenStorage"
import { AuthContext } from "./authContext"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  // טוענים רק אם יש Token שמור, אחרת ידוע מיד שאין משתמש
  const [isLoading, setIsLoading] = useState(() => tokenStorage.get() !== null)
  const [error, setError] = useState<unknown>(null)

  // אחרי רענון: מביאים את המשתמש המחובר לפי ה-Token השמור
  useEffect(() => {
    if (!tokenStorage.get()) return
    getCurrentUserApi()
      .then(setUser)
      .catch((err) => {
        // 401 = Token לא תקף, וה-interceptor כבר מחק אותו. בשגיאה אחרת (שרת לא זמין) ה-Token נשמר לרענון הבא
        if (!(isAxiosError(err) && err.response?.status === 401)) setError(err)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = (loggedInUser: AuthUser, token: string) => {
    tokenStorage.set(token)
    setUser(loggedInUser)
    setError(null)
  }

  const logout = () => {
    tokenStorage.remove()
    setUser(null)
  }

  return <AuthContext value={{ user, isLoading, error, login, logout }}>{children}</AuthContext>
}
