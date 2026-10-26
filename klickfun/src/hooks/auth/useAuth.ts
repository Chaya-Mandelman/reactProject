import { useContext } from "react"
import { AuthContext } from "../../context/authContext"

// שאר הקוד ניגש למשתמש המחובר רק דרך ה-hook הזה
export const useAuth = () => useContext(AuthContext)
