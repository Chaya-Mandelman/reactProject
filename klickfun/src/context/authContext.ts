import { createContext } from "react"
import type { AuthUser } from "@/types/auth"

export interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  // שגיאה בטעינת המשתמש שאינה 401, למשל כשהשרת לא זמין
  error: unknown
  login: (user: AuthUser, token: string) => void
  logout: () => void
}

// null = מחוץ ל-AuthProvider. useAuth זורק שגיאה במקרה הזה
export const AuthContext = createContext<AuthContextValue | null>(null)
