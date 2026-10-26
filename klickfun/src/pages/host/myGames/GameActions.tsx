import { useDeleteGame, useDuplicateGame } from "@/hooks/games/useGameMutations"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { DeleteButton } from "@/components/DeleteButton"
import type { GameSummary } from "@/types/game"

// לכל משחק יש mutation משלו, ולכן isPending ו-error שייכים רק לשורה הזו
export function GameActions({ game }: { game: GameSummary }) {
  const deleteGame = useDeleteGame()
  const duplicateGame = useDuplicateGame()

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
      <button className="cursor-pointer rounded-full font-bold transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100 border-2 border-cyan-400/70 bg-cyan-400/5 px-5 py-2 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.35)] hover:bg-cyan-400/15 hover:shadow-[0_0_22px_rgba(34,211,238,0.6)]" onClick={() => duplicateGame.mutate(game.id)} disabled={duplicateGame.isPending}>
        {duplicateGame.isPending ? "משכפל..." : "שכפול משחק"}
      </button>
      {duplicateGame.error && <span className="text-sm font-semibold text-rose-300" role="alert">{getErrorMessage(duplicateGame.error)}</span>}
      <DeleteButton
        confirmText={`למחוק את "${game.title}"?`}
        onConfirm={() => deleteGame.mutate(game.id)}
        isPending={deleteGame.isPending}
        error={deleteGame.error}
      />
    </div>
  )
}
