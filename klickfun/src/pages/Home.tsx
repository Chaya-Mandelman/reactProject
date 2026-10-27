import { Link, Navigate } from "react-router"
import { getHomePath, paths } from "@/constants/routes"
import { useAuth } from "@/hooks/auth/useAuth"
import { getErrorMessage } from "@/utils/getErrorMessage"

function Home() {
  const { user, isLoading, error } = useAuth()

  // משתמש מחובר עובר ישר לדף של התפקיד שלו
  if (isLoading) return <div className="status">טוען...</div>
  if (error) return <div className="alert mx-4 mt-10 sm:mx-auto sm:max-w-xl" role="alert">{getErrorMessage(error)}</div>
  if (user) return <Navigate to={getHomePath(user.role)} replace />

  return (
    <main className="stage-full flex min-h-svh flex-col items-center justify-center px-4 pb-48 text-center">
      <h1 className="gold-text text-7xl tracking-tight sm:text-8xl md:text-9xl">כיף Click</h1>
      <div className="frame-hex mt-10 flex w-full max-w-xl flex-col gap-3 px-16 py-9 sm:flex-row [border-image-width:56px]">
        <Link className="btn btn-gold btn-lg flex-1" to={paths.login}>כניסה</Link>
        <Link className="btn btn-ghost btn-lg flex-1" to={paths.register}>הרשמה</Link>
      </div>
    </main>
  )
}

export default Home
