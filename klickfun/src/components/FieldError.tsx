import type { FieldError as FormFieldError } from "react-hook-form"

export function FieldError({ error }: { error?: FormFieldError }) {
  return error ? <span role="alert">{error.message}</span> : null
}
