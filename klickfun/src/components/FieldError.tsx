import type { FieldError as FormFieldError } from "react-hook-form"

export function FieldError({ error }: { error?: FormFieldError }) {
  return error ? <span className="field-error block basis-full" role="alert">{error.message}</span> : null
}
