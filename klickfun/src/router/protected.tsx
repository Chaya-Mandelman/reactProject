import { useContext, type ReactNode } from "react"
import { Navigate, useLocation } from "react-router"
import { AuthContext } from "../context/user";


const Protected = ({ children, allow }: { children: ReactNode; allow: string }) => {
    const {user}=useContext(AuthContext)

        if (user?.role !== allow) {
            return <Navigate to="/" replace />
        }
    
    return <>{children}</>
}

export default Protected
