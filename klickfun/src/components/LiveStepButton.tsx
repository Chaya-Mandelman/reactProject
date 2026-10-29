import { useStepLive } from "@/hooks/gameRun/useStepLive"
import type { LiveAction } from "@/hooks/gameRun/useLiveMutation"
import { getErrorMessage } from "@/utils/getErrorMessage"

type Props = {
  gameId: number
  action: LiveAction
  to?: string
  label: string
  className?: string
}

const GOLD = "btn btn-gold [.cta_&]:h-14 [.cta_&]:px-12 [.cta_&]:text-lg"

// כפתור שמשנה את מצב המשחק ועובר לעמוד הבא, עם מצב טעינה והודעת שגיאה
export function LiveStepButton({ gameId, action, to, label, className = GOLD }: Props) {
  const { run, isPending, error } = useStepLive({ gameId, action, to })

  return (
    <>
      <button className={className} onClick={run} disabled={isPending}>
        {isPending ? "טוען..." : label}
      </button>
      {error !== null && <span className="field-error col-span-full block basis-full" role="alert">{getErrorMessage(error)}</span>}
    </>
  )
}
