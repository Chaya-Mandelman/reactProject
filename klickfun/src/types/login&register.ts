import type User from "./user"

export type AuthUser = Pick<User, "id" | "name" | "role">

// התשובה להתחברות ולהרשמה
export interface AuthResponse {
  "token": string,
  "user": AuthUser
}

export interface login
    {
  "email":string,
  "password": string
}

export interface register{
  "name": string,
  "email": string,
  "password": string
}
