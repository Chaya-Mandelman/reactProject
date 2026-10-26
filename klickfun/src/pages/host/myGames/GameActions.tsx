import { useDeleteGame, useDuplicateGame } from "@/hooks/games/useGameMutations"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { DeleteButton } from "@/components/DeleteButton"
import type { GameSummary } from "@/types/game"

// לכל משחק יש mutation משלו, ולכן isPending ו-error שייכים רק לשורה הזו
export function GameActions({ game }: { game: GameSummary }) {
  const deleteGame = useDeleteGame()
  const duplicateGame = useDuplicateGame()

  return (
    <div className="order-3 mt-2 flex w-full flex-wrap items-center gap-2 border-t border-white/10 pt-4">
      <button className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-8 px-3.5 text-xs border border-[#00E5FF]/30 bg-[#140A38]/80 text-[#C9BCEB] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[#00E5FF]/70 hover:bg-[#00E5FF]/10 hover:text-white hover:shadow-[0_0_18px_-4px_rgba(0,229,255,0.6)]" onClick={() => duplicateGame.mutate(game.id)} disabled={duplicateGame.isPending}>
        {duplicateGame.isPending ? "משכפל..." : "שכפול משחק"}
      </button>
      {duplicateGame.error && <span className="text-xs font-semibold text-rose-300" role="alert">{getErrorMessage(duplicateGame.error)}</span>}
      <DeleteButton
        confirmText={`למחוק את "${game.title}"?`}
        onConfirm={() => deleteGame.mutate(game.id)}
        isPending={deleteGame.isPending}
        error={deleteGame.error}
      />
    </div>
  )
}
