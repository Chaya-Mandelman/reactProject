import { DeleteButton } from "@/components/DeleteButton"
import { OpenButton } from "@/components/OpenButton"
import { GAME_STATUS_LABELS } from "@/constants/game"
import { useDeleteGame } from "@/hooks/games/useGameMutations"
import type { GameSummary } from "@/types/game"
import { GameDetailsView } from "./GameDetailsView"

export function AdminGameRow({ game }: { game: GameSummary }) {
  const deleteGame = useDeleteGame()

  return (
    <li>
      <div>{game.title} · {GAME_STATUS_LABELS[game.status]}</div>
      <div>מנחה: {game.host.name}</div>
      <div>שאלות: {game.questionsCount} · משתתפים: {game.participantsCount}</div>
      <OpenButton label="צפייה">{(close) => <GameDetailsView gameId={game.id} onClose={close} />}</OpenButton>
      <DeleteButton
        confirmText={`למחוק את "${game.title}" של ${game.host.name}?`}
        onConfirm={() => deleteGame.mutate(game.id)}
        isPending={deleteGame.isPending}
        error={deleteGame.error}
      />
    </li>
  )
}
