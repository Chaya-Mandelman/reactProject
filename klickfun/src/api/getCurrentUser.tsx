import { api } from "./apiClients"
import type { AuthResponse } from "../types/login&register"

export const getCurrentUserApi = async (): Promise<AuthResponse> => {
  const response = await api.get("/auth/me")
  return response.data
}
