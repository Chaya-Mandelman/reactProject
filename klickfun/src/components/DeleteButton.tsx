import { getErrorMessage } from "../utils/getErrorMessage"

type Props = {
  confirmText: string
  onConfirm: () => void
  isPending: boolean
  error: unknown
  disabled?: boolean
}

// כפתור מחיקה עם אישור, מצב טעינה והודעת שגיאה
export function DeleteButton({ confirmText, onConfirm, isPending, error, disabled }: Props) {
  return (
    <>
      <button onClick={() => confirm(confirmText) && onConfirm()} disabled={disabled || isPending}>
        {isPending ? "מוחק..." : "מחיקה"}
      </button>
      {error != null && <span role="alert">{getErrorMessage(error)}</span>}
    </>
  )
}
