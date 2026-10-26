import type { ReactNode } from "react"
import { Navigate } from "react-router"
import { paths } from "@/constants/routes"
import { useAuth } from "@/hooks/auth/useAuth"
import type { Role } from "@/types/user"
import { getErrorMessage } from "@/utils/getErrorMessage"

type Props = {
  allow: Role
  children: ReactNode
}

export function Protected({ allow, children }: Props) {
  const { user, isLoading, error } = useAuth()

  // אחרי רענון המשתמש עוד לא נטען מ-/auth/me, אז מחכים לפני שמחליטים
  if (isLoading) return <div>טוען...</div>
  if (error) return <div role="alert">{getErrorMessage(error)}</div>
  if (!user) return <Navigate to={paths.login} replace />
  if (user.role !== allow) return <Navigate to={paths.home} replace />

  return children
}
