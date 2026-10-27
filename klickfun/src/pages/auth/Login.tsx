import { Link, useNavigate } from "react-router"
import { FieldError } from "@/components/FieldError"
import { getHomePath, paths } from "@/constants/routes"
import { useAuth } from "@/hooks/auth/useAuth"
import { useLogin } from "@/hooks/auth/useLogin"
import { useApiForm } from "@/hooks/useApiForm"
import { loginSchema } from "./schema"

function Login() {
  "use no memo" // React Compiler מסתיר את השגיאות של react-hook-form
  const navigate = useNavigate()
  const { login } = useAuth()
  const loginMutation = useLogin()

  const { register, submit, serverError, formState: { errors, isSubmitting } } =
    useApiForm(loginSchema, { email: "", password: "" }, async (data) => {
      const { user, token } = await loginMutation.mutateAsync(data)
      login(user, token)
      navigate(getHomePath(user.role), { replace: true })
    })

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10">
      <form className="card w-full max-w-md px-9 py-10 before:mb-8 before:block before:bg-linear-to-b before:from-[#fff3c4] before:to-gold before:bg-clip-text before:text-center before:text-5xl before:font-black before:text-transparent before:content-['clickfun']" onSubmit={submit}>
        <fieldset className="flex flex-col gap-4" disabled={isSubmitting}>
          <label className="field">אימייל: <input className="input" type="email" {...register("email")} /></label>
          <FieldError error={errors.email} />
          <label className="field">סיסמה: <input className="input" type="password" {...register("password")} /></label>
          <FieldError error={errors.password} />
          {serverError && <p className="alert" role="alert">{serverError}</p>}
          <button className="btn btn-primary mt-2 h-12 w-full text-base" type="submit">{isSubmitting ? "מתחבר..." : "כניסה"}</button>
        </fieldset>
        <p className="mt-6 text-center text-sm text-muted">אין לך חשבון? <Link className="link" to={paths.register}>להרשמה</Link></p>
      </form>
    </main>
  )
}

export default Login
