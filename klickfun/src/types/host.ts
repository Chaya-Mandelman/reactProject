import type { User } from "./user"

// מנחה ברשימת הניהול
export type Host = Omit<User, "role"> & { gamesCount: number }

// בעריכה הסיסמה לא חובה: אם לא נשלחה, הסיסמה הקיימת נשארת
export interface HostInput {
  name: string
  email: string
  password?: string
}

export type HostUpdate = Partial<HostInput> & { isBlocked?: boolean }

export type HostStatus = "active" | "blocked"

export interface HostsFilters {
  search?: string
  status?: HostStatus
}
