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
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-fuchsia-500/30 bg-indigo-950/70 px-6 py-3 shadow-[0_4px_30px_rgba(168,85,247,0.3)] backdrop-blur-lg">
      <div className="font-bold text-amber-200">ברוכה הבאה: {user?.name}</div>
      {user?.role === "ADMIN" && (
        <nav className="flex gap-2">
          <NavLink className="rounded-full px-4 py-1.5 font-semibold text-violet-200 transition hover:bg-white/10 hover:text-white [&.active]:bg-fuchsia-600/80 [&.active]:text-white [&.active]:shadow-[0_0_16px_rgba(217,70,239,0.6)]" to={paths.adminGames}>כל המשחקים</NavLink>
          <NavLink className="rounded-full px-4 py-1.5 font-semibold text-violet-200 transition hover:bg-white/10 hover:text-white [&.active]:bg-fuchsia-600/80 [&.active]:text-white [&.active]:shadow-[0_0_16px_rgba(217,70,239,0.6)]" to={paths.adminHosts}>ניהול מנחים</NavLink>
        </nav>
      )}
      <button className="cursor-pointer rounded-full font-bold transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100 border-2 border-cyan-400/70 bg-cyan-400/5 px-5 py-2 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.35)] hover:bg-cyan-400/15 hover:shadow-[0_0_22px_rgba(34,211,238,0.6)]" onClick={handleLogout}>התנתקות</button>
    </header>
  )
}
