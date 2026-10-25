import { api } from "./apiClients"
import type { AuthResponse, login, register } from "../types/login&register"

export const loginApi = async (data: login): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data)
  return response.data
}

export const registerApi = async (data: register): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", data)
  return response.data
}

