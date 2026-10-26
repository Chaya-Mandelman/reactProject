import type { FieldError as Error } from "react-hook-form"

export function FieldError({ error }: { error?: Error }) {
  return error ? <span role="alert">{error.message}</span> : null
}
