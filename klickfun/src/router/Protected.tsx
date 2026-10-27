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

  if (isLoading) return <div className="status">טוען...</div>
  if (error) return <div className="alert mx-4 mt-10 sm:mx-auto sm:max-w-xl" role="alert">{getErrorMessage(error)}</div>
  if (!user) return <Navigate to={paths.login} replace />
  if (user.role !== allow) return <Navigate to={paths.home} replace />

  return children
}
