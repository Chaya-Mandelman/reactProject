import { useDeleteGame, useDuplicateGame } from "@/hooks/games/useGameMutations"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { DeleteButton } from "@/components/DeleteButton"
import type { GameSummary } from "@/types/game"

// לכל משחק יש mutation משלו, ולכן isPending ו-error שייכים רק לשורה הזו
export function GameActions({ game }: { game: GameSummary }) {
  const deleteGame = useDeleteGame()
  const duplicateGame = useDuplicateGame()

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2 border-t border-white/10 pt-4">
      <button className="btn btn-sm btn-ghost" onClick={() => duplicateGame.mutate(game.id)} disabled={duplicateGame.isPending}>
        {duplicateGame.isPending ? "משכפל..." : "שכפול משחק"}
      </button>
      {duplicateGame.error && <span className="field-error" role="alert">{getErrorMessage(duplicateGame.error)}</span>}
      <DeleteButton
        confirmText={`למחוק את "${game.title}"?`}
        onConfirm={() => deleteGame.mutate(game.id)}
        isPending={deleteGame.isPending}
        error={deleteGame.error}
      />
    </div>
  )
}
