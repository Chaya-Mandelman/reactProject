import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

// בהתחברות ובהרשמה 401 אומר סיסמה שגויה, לא Token שפג
const AUTH_FORMS = ["/auth/login", "/auth/register"]

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthForm = AUTH_FORMS.includes(error.config?.url ?? "")
    if (error.response?.status === 401 && !isAuthForm) {
      localStorage.removeItem("token")
      if (window.location.pathname !== "/login") {
        window.location.assign("/login")
      }
    }
    return Promise.reject(error)
  },
)
