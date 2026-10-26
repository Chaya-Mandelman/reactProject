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
    <form onSubmit={submit}>
      <fieldset disabled={isSubmitting}>
        <label>אימייל: <input type="email" {...register("email")} /></label>
        <FieldError error={errors.email} />
        <label>סיסמה: <input type="password" {...register("password")} /></label>
        <FieldError error={errors.password} />
        {serverError && <p role="alert">{serverError}</p>}
        <button type="submit">{isSubmitting ? "מתחבר..." : "כניסה"}</button>
      </fieldset>
      <p>אין לך חשבון? <Link to={paths.register}>להרשמה</Link></p>
    </form>
  )
}

export default Login
