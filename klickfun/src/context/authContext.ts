import { createContext } from "react"
import type { AuthUser } from "../types/auth"

export interface AuthContextType {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: AuthUser, token: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  token: null,
  isAuthenticated: false,
  isLoading: false,
  login: () => {},
  logout: () => {},
})
