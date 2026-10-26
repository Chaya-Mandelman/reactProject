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
      <button className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-11 px-6 text-sm bg-linear-to-b from-[#FFE082] to-[#FFCA28] text-[#08051F] shadow-[0_4px_0_0_#b8860b,0_10px_28px_-6px_rgba(255,202,40,0.7)] ring-1 ring-inset ring-white/50 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_6px_0_0_#b8860b,0_14px_34px_-4px_rgba(255,202,40,0.9)] active:translate-y-0.5 active:shadow-[0_1px_0_0_#b8860b,0_6px_18px_-6px_rgba(255,202,40,0.7)] [main>&]:h-14 [main>&]:px-12 [main>&]:text-lg" onClick={run} disabled={isPending}>
        {isPending ? "טוען..." : label}
      </button>
      {error !== null && <span className="block text-xs font-semibold text-rose-300" role="alert">{getErrorMessage(error)}</span>}
    </>
  )
}
