import { Outlet } from "react-router"
import { Header } from "@/components/Header"

// מבנה הדפים של משתמש מחובר: כותרת, ומתחתיה הדף עצמו
export function AppLayout() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <Outlet />
      </main>
    </>
  )
}
