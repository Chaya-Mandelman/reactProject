import type { ReactNode } from "react"
import { Navigate } from "react-router"
import { useAuth } from "../hooks/auth/useAuth"
import type User from "../types/user"

const Protected = ({ children, allow }: { children: ReactNode; allow: User["role"] }) => {
    const { user, isLoading } = useAuth()

    // אחרי רענון המשתמש עוד לא נטען מ-/auth/me, אז מחכים לפני שמחליטים
    if (isLoading) return <div>טוען...</div>
    if (!user) return <Navigate to="/login" replace />
    if (user.role !== allow) return <Navigate to="/" replace />

    return <>{children}</>
}

export default Protected
