import type { LiveState } from "../types/liveState"
import { useStepLive, type PlayPage } from "../hooks/gameRun/useStepLive"
import { getErrorMessage } from "../utils/getErrorMessage"

type Props = {
  gameId: number
  funcApi: (id: number) => Promise<LiveState>
  namePage: PlayPage
  label: string
}

// כפתור שמשנה את מצב המשחק ועובר לעמוד הבא, עם מצב טעינה והודעת שגיאה
export function LiveStepButton({ gameId, funcApi, namePage, label }: Props) {
  const { run, isPending, error } = useStepLive({ gameId, funcApi, namePage })

  return (
    <>
      <button onClick={run} disabled={isPending}>
        {isPending ? "טוען..." : label}
      </button>
      {error != null && <span role="alert">{getErrorMessage(error)}</span>}
    </>
  )
}
