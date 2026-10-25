
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "./schema"
import type { RegisterData } from "./schema"
import { useRegister } from "../../hooks/users/useRegister"
import axios from "axios"
import { useNavigate } from "react-router"
import { useAuth } from "../../context/user"


export function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const {
    register, handleSubmit, reset, formState: { errors, isValid }, }
    = useForm<RegisterData>({
      resolver: zodResolver(registerSchema),
      mode: "onChange",
      defaultValues: {
        name: "",
        email: "",
        password: "",
      },
    })

  const registerMutation = useRegister()

  const onSubmit = (data: RegisterData) => {
    registerMutation.mutate(data, {
      onSuccess: (response) => {
        login(response.user, response.token)
        console.log("Registration successful:", response)
        reset()
        navigate(response.user?.role === "HOST" ? "/games": "/admin" , { replace: true })
      },
    })
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" {...register("name")} />
        {errors.name && <span>{errors.name.message}</span>}
      </div>
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
      {registerMutation.isError && (
        <p role="alert" style={{ color: "red" }}>
          {axios.isAxiosError(registerMutation.error)
            ? registerMutation.error.response?.data?.message ||
            "Registration failed"
            : "Something went wrong"}
        </p>
      )}
      <button
        type="submit"
        disabled={!isValid || registerMutation.isPending}
      >
        {registerMutation.isPending
          ? "Registering..."
          : "Register"}
      </button>
    </form>
  )
}

export default Register
