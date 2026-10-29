import type { GameStatus } from "@/types/game"
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

// משחק פעיל: בלובי חוזרים ללובי, ואחרי שהתחיל חוזרים למסך המשחק
export const getLivePath = (gameId: number, status: GameStatus) =>
  paths.play(gameId, status === "LOBBY" ? "lobby" : "game")
