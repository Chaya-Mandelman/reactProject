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
      <button className="cursor-pointer rounded-full font-bold transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100 border-2 border-rose-400/70 bg-rose-500/10 px-5 py-2 text-rose-100 shadow-[0_0_12px_rgba(251,113,133,0.35)] hover:bg-rose-500/25 hover:shadow-[0_0_22px_rgba(251,113,133,0.6)]" onClick={() => confirm(confirmText) && onConfirm()} disabled={disabled || isPending}>
        {isPending ? "מוחק..." : "מחיקה"}
      </button>
      {error !== null && <span className="text-sm font-semibold text-rose-300" role="alert">{getErrorMessage(error)}</span>}
    </>
  )
}
