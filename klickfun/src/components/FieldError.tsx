import type { FieldError as FormFieldError } from "react-hook-form"

export function FieldError({ error }: { error?: FormFieldError }) {
  return error ? <span className="block text-xs font-semibold text-rose-300" role="alert">{error.message}</span> : null
}
