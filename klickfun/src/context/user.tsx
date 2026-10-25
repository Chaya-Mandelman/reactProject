import { createContext, useContext, type ReactNode } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getCurrentUser } from "../api/getCurrentUser"
import type { AuthUser } from "../types/login&register"

type Auth = {
  user: AuthUser | null
  isLoading: boolean
  login: (user: AuthUser, token: string) => void
  logout: () => void
}

const AuthContext = createContext<Auth | null>(null)
const ME = ["me"]

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient()

  const { data: user = null, isLoading } = useQuery({
    queryKey: ME,
    queryFn: () =>
      getCurrentUser()
        .then((res) => res.user)
        .catch(() => {
          localStorage.removeItem("token")
          return null
        }),
    enabled: !!localStorage.getItem("token"),
    staleTime: Infinity,
    retry: false,
  })

  const login = (user: AuthUser, token: string) => {
    localStorage.setItem("token", token)
    queryClient.setQueryData(ME, user)
  }

  const logout = () => {
    localStorage.removeItem("token")
    queryClient.setQueryData(ME, null)
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
