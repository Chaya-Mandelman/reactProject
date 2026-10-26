import { Link, Navigate } from "react-router"
import { getHomePath, paths } from "@/constants/routes"
import { useAuth } from "@/hooks/auth/useAuth"
import { getErrorMessage } from "@/utils/getErrorMessage"

function Home() {
  const { user, isLoading, error } = useAuth()

  // משתמש מחובר עובר ישר לדף של התפקיד שלו
  if (isLoading) return <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-20 animate-pulse text-center text-[#C9BCEB]">טוען...</div>
  if (error) return <div className="mx-auto w-[calc(100%-2rem)] max-w-5xl my-4 block rounded-2xl border border-rose-400/40 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 shadow-[0_0_24px_-8px_rgba(244,63,94,0.55)] backdrop-blur-md" role="alert">{getErrorMessage(error)}</div>
  if (user) return <Navigate to={getHomePath(user.role)} replace />

  return (
    <>
      <h1 className="mx-auto w-[calc(100%-2rem)] max-w-5xl mt-[16vh] mb-14 text-center text-6xl font-black tracking-tight sm:mt-[20vh] sm:text-8xl md:text-9xl bg-linear-to-b from-[#FFF3C4] via-[#FFCA28] to-[#F5A300] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(255,202,40,0.45)] after:mx-auto after:block after:rounded-full after:bg-linear-to-l after:from-[#F03CFF] after:via-[#00E5FF] after:to-[#FFCA28] after:shadow-[0_0_12px_rgba(0,229,255,0.7)] after:mt-8 after:w-32 after:h-1.5">כיף Click</h1>
      <Link className="mx-auto mb-4 flex w-72 max-w-[calc(100%-2rem)] inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-14 text-lg bg-linear-to-b from-[#F03CFF] to-[#A855F7] text-white shadow-[0_4px_0_0_#6b1f9e,0_10px_28px_-6px_rgba(240,60,255,0.7)] ring-1 ring-inset ring-white/25 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_6px_0_0_#6b1f9e,0_14px_34px_-4px_rgba(240,60,255,0.9)] active:translate-y-0.5 active:shadow-[0_1px_0_0_#6b1f9e,0_6px_18px_-6px_rgba(240,60,255,0.7)]" to={paths.login}>כניסה</Link>
      <Link className="mx-auto flex w-72 max-w-[calc(100%-2rem)] inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-14 text-lg border border-[#00E5FF]/30 bg-[#140A38]/80 text-[#C9BCEB] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[#00E5FF]/70 hover:bg-[#00E5FF]/10 hover:text-white hover:shadow-[0_0_18px_-4px_rgba(0,229,255,0.6)]" to={paths.register}>הרשמה</Link>
    </>
  )
}

export default Home
