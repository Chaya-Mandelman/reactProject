import { useContext } from "react"
import { AuthContext } from "@/context/authContext"

// שאר הקוד ניגש למשתמש המחובר רק דרך ה-hook הזה
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}
