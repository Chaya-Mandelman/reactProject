import { useNavigate } from "react-router"
import { useAuth } from "../hooks/auth/useAuth"

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header>
      <div>ברוכה הבאה: {user?.name}</div>
      <button onClick={() => {
        logout()
        navigate("/", { replace: true })
      }}>התנתקות</button>
    </header>
  )
}
