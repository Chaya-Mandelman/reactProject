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
  if (isLoading) return <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-16 animate-pulse text-center text-lg text-violet-200">טוען...</div>
  if (error) return <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 rounded-xl border border-rose-400/60 bg-rose-500/15 px-4 py-2 font-semibold text-rose-200" role="alert">{getErrorMessage(error)}</div>
  if (!user) return <Navigate to={paths.login} replace />
  if (user.role !== allow) return <Navigate to={paths.home} replace />

  return children
}
