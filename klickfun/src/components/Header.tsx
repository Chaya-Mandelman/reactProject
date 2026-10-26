import { NavLink, useNavigate } from "react-router"
import { paths } from "@/constants/routes"
import { useAuth } from "@/hooks/auth/useAuth"

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(paths.home, { replace: true })
  }

  return (
    <header>
      <div>ברוכה הבאה: {user?.name}</div>
      {user?.role === "ADMIN" && (
        <nav>
          <NavLink to={paths.adminGames}>כל המשחקים</NavLink>
          <NavLink to={paths.adminHosts}>ניהול מנחים</NavLink>
        </nav>
      )}
      <button onClick={handleLogout}>התנתקות</button>
    </header>
  )
}
