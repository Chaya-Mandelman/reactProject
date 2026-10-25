import { useMutation } from "@tanstack/react-query"
import {  loginApi } from "../../api/login&register"

export function useLogin() {
  return useMutation({
    mutationFn: loginApi,
  })
}