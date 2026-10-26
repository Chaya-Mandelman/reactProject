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
    <header className="sticky top-0 z-20 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-[#A855F7]/25 bg-[#08051F]/80 px-4 shadow-[0_1px_0_rgba(0,229,255,0.15),0_10px_30px_-15px_rgba(168,85,247,0.6)] sm:px-6 py-3 backdrop-blur-xl before:bg-linear-to-b before:from-[#FFE082] before:to-[#FFCA28] before:drop-shadow-[0_0_10px_rgba(255,202,40,0.5)] before:bg-clip-text before:text-xl before:font-black before:text-transparent before:content-['כיף_Click']">
      <div className="text-sm text-[#C9BCEB]/80">ברוכה הבאה: {user?.name}</div>
      {user?.role === "ADMIN" && (
        <nav className="flex gap-1 rounded-full border border-[#A855F7]/25 bg-[#140A38]/80 p-1">
          <NavLink className="rounded-full px-4 py-1.5 text-sm font-semibold text-[#C9BCEB] transition duration-200 hover:bg-white/5 hover:text-white [&.active]:bg-linear-to-l [&.active]:from-[#F03CFF] [&.active]:to-[#A855F7] [&.active]:text-white [&.active]:shadow-[0_6px_18px_-6px_rgba(240,60,255,0.9)]" to={paths.adminGames}>כל המשחקים</NavLink>
          <NavLink className="rounded-full px-4 py-1.5 text-sm font-semibold text-[#C9BCEB] transition duration-200 hover:bg-white/5 hover:text-white [&.active]:bg-linear-to-l [&.active]:from-[#F03CFF] [&.active]:to-[#A855F7] [&.active]:text-white [&.active]:shadow-[0_6px_18px_-6px_rgba(240,60,255,0.9)]" to={paths.adminHosts}>ניהול מנחים</NavLink>
        </nav>
      )}
      <button className="ms-auto inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-8 px-3.5 text-xs border border-[#00E5FF]/30 bg-[#140A38]/80 text-[#C9BCEB] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[#00E5FF]/70 hover:bg-[#00E5FF]/10 hover:text-white hover:shadow-[0_0_18px_-4px_rgba(0,229,255,0.6)]" onClick={handleLogout}>התנתקות</button>
    </header>
  )
}
