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
    <form onSubmit={submit}>
      <fieldset disabled={isSubmitting}>
        <label>שם: <input {...register("name")} /></label>
        <FieldError error={errors.name} />
        <label>אימייל: <input type="email" {...register("email")} /></label>
        <FieldError error={errors.email} />
        <label>סיסמה: <input type="password" {...register("password")} /></label>
        <FieldError error={errors.password} />
        {serverError && <p role="alert">{serverError}</p>}
        <button type="submit">{isSubmitting ? "נרשם..." : "הרשמה"}</button>
      </fieldset>
      <p>יש לך חשבון? <Link to={paths.login}>לכניסה</Link></p>
    </form>
  )
}

export default Register
