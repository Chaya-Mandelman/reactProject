import axios from "axios"
import { paths } from "@/constants/routes"
import { tokenStorage } from "@/utils/tokenStorage"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// בהתחברות ובהרשמה 401 אומר סיסמה שגויה, לא Token שפג
const AUTH_FORMS = ["/auth/login", "/auth/register"]

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthForm = AUTH_FORMS.includes(error.config?.url ?? "")
    if (error.response?.status === 401 && !isAuthForm) {
      tokenStorage.remove()
      if (window.location.pathname !== paths.login) window.location.assign(paths.login)
    }
    return Promise.reject(error)
  },
)
