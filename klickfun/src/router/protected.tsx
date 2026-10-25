
import type { ReactNode } from "react"
import { Navigate } from "react-router"
import { useAuthStore } from "../store/authStore"

const Protected = ({ children, allow }: { children: ReactNode; allow: string }) => {
    const role = useAuthStore(state => state.user?.role)
    if (role != allow) {
        return <Navigate to="/" />
    }   
    return <>{children}</>
}

export default Protected