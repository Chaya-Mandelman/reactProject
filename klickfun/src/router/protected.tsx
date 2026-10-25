import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router"
import { useAuth } from "../context/user"

const Protected = ({ children, allow }: { children: ReactNode; allow: string }) => {
    const location = useLocation()
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return <div>טוען...</div>
    }
    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }
    if (user.role !== allow) {
        return <Navigate to="/" replace />
    }
    return <>{children}</>
}

export default Protected
