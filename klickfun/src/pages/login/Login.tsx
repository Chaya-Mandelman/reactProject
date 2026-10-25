
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginScema } from "./schema"
import type { LoginData } from "./schema"
import { useLogin } from "../../hooks/users/useLogin"
import { useNavigate } from "react-router"
import { useAuth } from "../../context/user"
import { Link } from "react-router"
import { getErrorMessage, setFieldErrors } from "../../function/getErrorMessage"


export function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const {
    register, handleSubmit, reset, setError, formState: { errors, isValid }, }
    = useForm<LoginData>({
      resolver: zodResolver(loginScema),
      mode: "onChange",
      defaultValues: {
        email: "",
        password: "",
      },
    })

  const loginMutation = useLogin()

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        login(response.user, response.token)
        console.log("Login successful:", response)
        navigate(
          response.user?.role === "HOST" ?  "/games": "/admin",
          { replace: true }
        )
        reset()
      },
      onError: (error) => {
        setFieldErrors(error, setError, ["email", "password"])
      },
    })
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" {...register("email")} />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" {...register("password")} />
        {errors.password && <span>{errors.password.message}</span>}
      </div>
      {loginMutation.isError && (
        <p role="alert" style={{ color: "red" }}>
          {getErrorMessage(loginMutation.error)}
        </p>
      )}
      <button
        type="submit"
        disabled={!isValid || loginMutation.isPending}
      >
        {loginMutation.isPending
          ? "Logging in..."
          : "Login"}
      </button>
      
            <p className="text-center text-sm text-muted">
             אין לך חשבון? <Link to="/register" className="link">להרשמה</Link>
            </p>
    </form>
  )
}

export default Login
