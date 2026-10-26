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
  if (isLoading) return <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-20 animate-pulse text-center text-[#C9BCEB]">טוען...</div>
  if (error) return <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 block rounded-2xl border border-rose-400/40 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 shadow-[0_0_24px_-8px_rgba(244,63,94,0.55)] backdrop-blur-md" role="alert">{getErrorMessage(error)}</div>
  if (!user) return <Navigate to={paths.login} replace />
  if (user.role !== allow) return <Navigate to={paths.home} replace />

  return children
}
