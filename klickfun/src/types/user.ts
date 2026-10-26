export type Role = "ADMIN" | "HOST"

export interface User {
  id: number
  name: string
  email: string
  role: Role
  isBlocked: boolean
  createdAt: string
}
