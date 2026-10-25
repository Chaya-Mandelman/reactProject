
import type { AuthUser } from "../types/login&register"
import {
  createContext,
  useEffect,
  useState,
} from "react"
import type { ReactNode } from "react"
import { getCurrentUserApi } from "../api/getCurrentUser"


interface AuthContexType {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: AuthUser, token: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContexType>({
  user: null,
  setUser: () => {},
  token: null,
  isAuthenticated: false,
  isLoading: false,
  login: () => {},
  logout: () => {},
})

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const savedToken = localStorage.getItem("token")

      if (!savedToken) {
        setIsLoading(false)
        return
      }

      try {
        const me = await getCurrentUserApi()

        setToken(savedToken)
        setUser(me.user)
        setIsAuthenticated(true)
      } catch {
        localStorage.removeItem("token")
        setToken(null)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [])

  const login = (user: AuthUser, token: string) => {
    localStorage.setItem("token", token)
    setToken(token)
    setUser(user)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
   

  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
