import { useMutation } from "@tanstack/react-query"
import { registerApi } from "../../api/login&register"

export function useRegister() {
  return useMutation({
    mutationFn: registerApi,
  })
}