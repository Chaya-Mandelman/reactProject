import { Link, useNavigate } from "react-router"
import { FieldError } from "@/components/FieldError"
import { getHomePath, paths } from "@/constants/routes"
import { useAuth } from "@/hooks/auth/useAuth"
import { useRegister } from "@/hooks/auth/useRegister"
import { useApiForm } from "@/hooks/useApiForm"
import { registerSchema } from "./schema"

function Register() {
  "use no memo" // React Compiler מסתיר את השגיאות של react-hook-form
  const navigate = useNavigate()
  const { login } = useAuth()
  const registerMutation = useRegister()

  const { register, submit, serverError, formState: { errors, isSubmitting } } =
    useApiForm(registerSchema, { name: "", email: "", password: "" }, async (data) => {
      const { user, token } = await registerMutation.mutateAsync(data)
      login(user, token)
      navigate(getHomePath(user.role), { replace: true })
    })

  return (
    <form className="mx-auto mt-[14vh] mb-10 w-[calc(100%-2rem)] max-w-md rounded-3xl border border-[#A855F7]/30 bg-linear-to-b from-[#21104D]/90 to-[#140A38]/90 p-6 sm:p-8 text-start shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9),0_0_40px_-22px_rgba(168,85,247,0.7)] ring-1 ring-inset ring-white/5 backdrop-blur-xl before:mb-8 before:block before:text-center before:text-3xl before:font-black before:content-['כיף_Click'] before:bg-linear-to-b before:from-[#FFF3C4] before:to-[#FFCA28] before:drop-shadow-[0_0_16px_rgba(255,202,40,0.45)] before:bg-clip-text before:text-transparent" onSubmit={submit}>
      <fieldset className="flex flex-col gap-4" disabled={isSubmitting}>
        <label className="flex flex-col gap-2 text-sm font-medium text-[#C9BCEB]">שם: <input className="h-11 rounded-xl border border-[#A855F7]/25 bg-[#08051F]/60 px-4 text-sm text-white placeholder:text-[#C9BCEB]/40 outline-none transition duration-200 hover:border-[#A855F7]/45 focus:border-[#00E5FF]/70 focus:bg-[#08051F]/80 focus:ring-4 focus:ring-[#00E5FF]/15" {...register("name")} /></label>
        <FieldError error={errors.name} />
        <label className="flex flex-col gap-2 text-sm font-medium text-[#C9BCEB]">אימייל: <input className="h-11 rounded-xl border border-[#A855F7]/25 bg-[#08051F]/60 px-4 text-sm text-white placeholder:text-[#C9BCEB]/40 outline-none transition duration-200 hover:border-[#A855F7]/45 focus:border-[#00E5FF]/70 focus:bg-[#08051F]/80 focus:ring-4 focus:ring-[#00E5FF]/15" type="email" {...register("email")} /></label>
        <FieldError error={errors.email} />
        <label className="flex flex-col gap-2 text-sm font-medium text-[#C9BCEB]">סיסמה: <input className="h-11 rounded-xl border border-[#A855F7]/25 bg-[#08051F]/60 px-4 text-sm text-white placeholder:text-[#C9BCEB]/40 outline-none transition duration-200 hover:border-[#A855F7]/45 focus:border-[#00E5FF]/70 focus:bg-[#08051F]/80 focus:ring-4 focus:ring-[#00E5FF]/15" type="password" {...register("password")} /></label>
        <FieldError error={errors.password} />
        {serverError && <p className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 shadow-[0_0_24px_-8px_rgba(244,63,94,0.55)] backdrop-blur-md" role="alert">{serverError}</p>}
        <button className="mt-2 w-full inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-12 text-base bg-linear-to-b from-[#F03CFF] to-[#A855F7] text-white shadow-[0_4px_0_0_#6b1f9e,0_10px_28px_-6px_rgba(240,60,255,0.7)] ring-1 ring-inset ring-white/25 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_6px_0_0_#6b1f9e,0_14px_34px_-4px_rgba(240,60,255,0.9)] active:translate-y-0.5 active:shadow-[0_1px_0_0_#6b1f9e,0_6px_18px_-6px_rgba(240,60,255,0.7)]" type="submit">{isSubmitting ? "נרשם..." : "הרשמה"}</button>
      </fieldset>
      <p className="mt-6 text-center text-sm text-[#C9BCEB]/75">יש לך חשבון? <Link className="font-semibold text-[#00E5FF] transition duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" to={paths.login}>לכניסה</Link></p>
    </form>
  )
}

export default Register
