
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginScema } from "./schema"
import type { LoginData } from "./schema"
import axios from "axios"
import { useLogin } from "../../hooks/users/useLogin"
import { useNavigate } from "react-router"
import { useAuth } from "../../context/user"
import type { ApiError } from "../../types/apiError"



export function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const {
    register, handleSubmit, reset, formState: { errors, isValid }, }
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
      {loginMutation.isError && <p>{getErrorMessage()}</p>}
      <button
        type="submit"
        disabled={!isValid || loginMutation.isPending}
      >
        {loginMutation.isPending
          ? "Logging in..."
          : "Login"}
      </button>
    </form>
  )
}

export default Login
