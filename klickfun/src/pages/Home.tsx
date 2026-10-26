import { Link, Navigate } from "react-router"
import { useAuth } from "../hooks/auth/useAuth"

function Home() {
    const { user, isLoading } = useAuth()

    // משתמש מחובר עובר ישר לדף של התפקיד שלו
    if (isLoading) return <div>טוען...</div>
    if (user) return <Navigate to={user.role === "HOST" ? "/games" : "/admin/games"} replace />

    return (
        <>
            <div>Home</div>
            <Link to="/login">כניסה</Link>
            <Link to="/register">הרשמה</Link>
        </>
    )
}

export default Home
