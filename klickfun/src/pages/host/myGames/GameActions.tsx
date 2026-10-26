import { useDeleteGame, useDuplicateGame } from "../../../hooks/games/useGameMutations"
import { getErrorMessage } from "../../../utils/getErrorMessage"
import { DeleteButton } from "../../../components/DeleteButton"
import type { GameSummary } from "../../../types/game"

// לכל משחק יש mutation משלו, ולכן isPending ו-error שייכים רק לשורה הזו
export function GameActions({ game }: { game: GameSummary }) {
  const deleteGame = useDeleteGame()
  const duplicateGame = useDuplicateGame()

  return (
    <div>
      <button onClick={() => duplicateGame.mutate(game.id)} disabled={duplicateGame.isPending}>
        {duplicateGame.isPending ? "משכפל..." : "שכפול משחק"}
      </button>
      {duplicateGame.error && <span role="alert">{getErrorMessage(duplicateGame.error)}</span>}
      <DeleteButton
        confirmText={`למחוק את "${game.title}"?`}
        onConfirm={() => deleteGame.mutate(game.id)}
        isPending={deleteGame.isPending}
        error={deleteGame.error}
      />
    </div>
  )
}
