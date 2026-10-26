import type User from "./user"

export type AuthUser = Pick<User, "id" | "name" | "role">

// התשובה להתחברות ולהרשמה
export interface AuthResponse {
  "token": string,
  "user": AuthUser
}

export interface LoginInput {
  "email": string,
  "password": string
}

export interface RegisterInput {
  "name": string,
  "email": string,
  "password": string
}
