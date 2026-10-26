import type { GameStatus, GamesSort } from "@/types/game"

export const GAME_STATUS_LABELS: Record<GameStatus, string> = {
  SETUP: "בהכנה",
  LOBBY: "בהמתנה",
  RUNNING: "פעיל",
  PAUSED: "מושהה",
  FINISHED: "הסתיים",
}

export const GAMES_SORT_LABELS: Record<GamesSort, string> = {
  newest: "החדשים ביותר",
  oldest: "הישנים ביותר",
  title: "לפי שם המשחק",
}

// משחק בסטטוסים האלה פתוח בשרת: אי אפשר לערוך אותו, ונכנסים אליו דרך הלובי
export const ACTIVE_STATUSES: readonly GameStatus[] = ["LOBBY", "RUNNING", "PAUSED"]

export const isActiveStatus = (status: GameStatus) => ACTIVE_STATUSES.includes(status)
