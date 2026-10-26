import { useMutation } from "@tanstack/react-query"
import { registerApi } from "../../api/auth"

export function useRegister() {
  return useMutation({
    mutationFn: registerApi,
  })
}
