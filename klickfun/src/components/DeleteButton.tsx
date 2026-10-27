import { getErrorMessage } from "@/utils/getErrorMessage"

type Props = {
  confirmText: string
  onConfirm: () => void
  isPending: boolean
  error: Error | null
  disabled?: boolean
}

// כפתור מחיקה עם אישור, מצב טעינה והודעת שגיאה
export function DeleteButton({ confirmText, onConfirm, isPending, error, disabled }: Props) {
  return (
    <>
      <button className="btn btn-sm btn-danger" onClick={() => confirm(confirmText) && onConfirm()} disabled={disabled || isPending}>
        {isPending ? "מוחק..." : "מחיקה"}
      </button>
      {error !== null && <span className="field-error" role="alert">{getErrorMessage(error)}</span>}
    </>
  )
}
