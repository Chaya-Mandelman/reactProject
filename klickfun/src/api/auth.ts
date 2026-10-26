import { api } from "./apiClient"
import type { AuthResponse, AuthUser, LoginInput, RegisterInput } from "../types/auth"

export const loginApi = async (data: LoginInput): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data)
  return response.data
}

export const registerApi = async (data: RegisterInput): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", data)
  return response.data
}

export const getCurrentUserApi = async (): Promise<{ user: AuthUser }> => {
  const response = await api.get<{ user: AuthUser }>("/auth/me")
  return response.data
}
