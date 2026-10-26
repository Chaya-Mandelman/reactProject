import { Outlet } from "react-router"
import { Header } from "@/components/Header"

// מבנה הדפים של משתמש מחובר: כותרת, ומתחתיה הדף עצמו
export function AppLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
