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
    <header className="sticky top-0 z-20 border-b border-gold/40 bg-[#020a1f]/90 shadow-[0_1px_0_rgb(63_208_255/0.15),0_10px_30px_-10px_rgb(0_0_0/0.8)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6 before:bg-linear-to-b before:from-[#fff3c4] before:to-gold before:bg-clip-text before:text-2xl before:font-black before:text-transparent before:content-['clickfun']">
        {user?.role === "ADMIN" && (
          <nav className="flex gap-1 rounded-full border border-cyan/25 bg-navy/80 p-1">
            <NavLink className="rounded-full px-4 py-1.5 text-sm font-semibold text-muted transition duration-200 hover:text-white [&.active]:bg-gold [&.active]:text-[#1a1000]" to={paths.adminGames}>כל המשחקים</NavLink>
            <NavLink className="rounded-full px-4 py-1.5 text-sm font-semibold text-muted transition duration-200 hover:text-white [&.active]:bg-gold [&.active]:text-[#1a1000]" to={paths.adminHosts}>ניהול מנחים</NavLink>
          </nav>
        )}
        <div className="ms-auto text-sm text-muted">ברוכה הבאה: {user?.name}</div>
        <button className="btn btn-sm btn-ghost" onClick={handleLogout}>התנתקות</button>
      </div>
    </header>
  )
}
