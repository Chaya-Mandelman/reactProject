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
      <button className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-8 px-3.5 text-xs border border-rose-400/35 bg-rose-500/10 text-rose-200 hover:border-rose-400/80 hover:bg-rose-500/20 hover:text-white hover:shadow-[0_0_18px_-4px_rgba(244,63,94,0.6)]" onClick={() => confirm(confirmText) && onConfirm()} disabled={disabled || isPending}>
        {isPending ? "מוחק..." : "מחיקה"}
      </button>
      {error !== null && <span className="text-xs font-semibold text-rose-300" role="alert">{getErrorMessage(error)}</span>}
    </>
  )
}
