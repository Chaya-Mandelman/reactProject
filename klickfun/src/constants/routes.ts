import type { Role } from "@/types/user"
import type { PlayPage } from "@/types/liveState"

export const paths = {
  home: "/",
  login: "/login",
  register: "/register",
  myGames: "/games",
  editGame: (gameId: number) => `/games/edit/${gameId}`,
  play: (gameId: number, page: PlayPage) => `/play/${gameId}/${page}`,
  adminGames: "/admin/games",
  adminHosts: "/admin/hosts",
} as const

// הדף הראשי של כל תפקיד אחרי התחברות
export const getHomePath = (role: Role) => (role === "HOST" ? paths.myGames : paths.adminGames)
