import { useMutation } from "@tanstack/react-query"
import { loginApi } from "@/api/auth"

export function useLogin() {
  return useMutation({ mutationFn: loginApi })
}
