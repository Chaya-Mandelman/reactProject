import { useStepLive } from "@/hooks/gameRun/useStepLive"
import type { LiveAction } from "@/hooks/gameRun/useLiveMutation"
import type { PlayPage } from "@/types/liveState"
import { getErrorMessage } from "@/utils/getErrorMessage"

type Props = {
  gameId: number
  action: LiveAction
  nextPage?: PlayPage
  label: string
}

// כפתור שמשנה את מצב המשחק ועובר לעמוד הבא, עם מצב טעינה והודעת שגיאה
export function LiveStepButton({ gameId, action, nextPage, label }: Props) {
  const { run, isPending, error } = useStepLive({ gameId, action, nextPage })

  return (
    <>
      <button className="btn btn-gold [.cta_&]:h-14 [.cta_&]:px-12 [.cta_&]:text-lg" onClick={run} disabled={isPending}>
        {isPending ? "טוען..." : label}
      </button>
      {error !== null && <span className="field-error col-span-full block basis-full" role="alert">{getErrorMessage(error)}</span>}
    </>
  )
}
