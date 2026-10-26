import { Link, Navigate } from "react-router"
import { getHomePath, paths } from "@/constants/routes"
import { useAuth } from "@/hooks/auth/useAuth"
import { getErrorMessage } from "@/utils/getErrorMessage"

function Home() {
  const { user, isLoading, error } = useAuth()

  // משתמש מחובר עובר ישר לדף של התפקיד שלו
  if (isLoading) return <div>טוען...</div>
  if (error) return <div role="alert">{getErrorMessage(error)}</div>
  if (user) return <Navigate to={getHomePath(user.role)} replace />

  return (
    <>
      <h1>כיף Click</h1>
      <Link to={paths.login}>כניסה</Link>
      <Link to={paths.register}>הרשמה</Link>
    </>
  )
}

export default Home
