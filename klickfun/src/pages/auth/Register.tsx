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
    <form className="mx-auto mt-[12vh] mb-10 w-[calc(100%-2rem)] max-w-md rounded-3xl border-2 border-fuchsia-400/50 bg-indigo-950/70 p-6 shadow-[0_0_30px_rgba(168,85,247,0.35),inset_0_0_30px_rgba(168,85,247,0.15)] backdrop-blur-md" onSubmit={submit}>
      <fieldset className="flex flex-col gap-3" disabled={isSubmitting}>
        <label className="flex flex-col gap-1.5 font-semibold text-violet-200">שם: <input className="rounded-xl border-2 border-violet-400/40 bg-indigo-950/70 px-4 py-2.5 text-white placeholder:text-violet-300/50 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_16px_rgba(34,211,238,0.45)]" {...register("name")} /></label>
        <FieldError error={errors.name} />
        <label className="flex flex-col gap-1.5 font-semibold text-violet-200">אימייל: <input className="rounded-xl border-2 border-violet-400/40 bg-indigo-950/70 px-4 py-2.5 text-white placeholder:text-violet-300/50 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_16px_rgba(34,211,238,0.45)]" type="email" {...register("email")} /></label>
        <FieldError error={errors.email} />
        <label className="flex flex-col gap-1.5 font-semibold text-violet-200">סיסמה: <input className="rounded-xl border-2 border-violet-400/40 bg-indigo-950/70 px-4 py-2.5 text-white placeholder:text-violet-300/50 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_16px_rgba(34,211,238,0.45)]" type="password" {...register("password")} /></label>
        <FieldError error={errors.password} />
        {serverError && <p className="rounded-xl border border-rose-400/60 bg-rose-500/15 px-4 py-2 font-semibold text-rose-200" role="alert">{serverError}</p>}
        <button className="mt-2 cursor-pointer rounded-full font-bold transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100 border border-fuchsia-300/50 bg-linear-to-l from-fuchsia-600 via-purple-600 to-violet-600 px-6 py-2.5 text-white shadow-[0_0_20px_rgba(217,70,239,0.55)] hover:scale-105 hover:shadow-[0_0_32px_rgba(217,70,239,0.85)]" type="submit">{isSubmitting ? "נרשם..." : "הרשמה"}</button>
      </fieldset>
      <p className="mt-5 text-center text-violet-300">יש לך חשבון? <Link className="font-bold text-cyan-300 underline-offset-4 hover:underline" to={paths.login}>לכניסה</Link></p>
    </form>
  )
}

export default Register
