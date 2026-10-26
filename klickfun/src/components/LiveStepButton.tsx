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
      <button className="cursor-pointer rounded-full font-bold transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100 border-2 border-amber-200 bg-linear-to-b from-amber-300 to-amber-500 px-7 py-3 text-lg font-black text-indigo-950 shadow-[0_0_28px_rgba(251,191,36,0.6)] hover:scale-105 hover:shadow-[0_0_40px_rgba(251,191,36,0.9)]" onClick={run} disabled={isPending}>
        {isPending ? "טוען..." : label}
      </button>
      {error !== null && <span className="text-sm font-semibold text-rose-300" role="alert">{getErrorMessage(error)}</span>}
    </>
  )
}
