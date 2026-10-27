import { DeleteButton } from "@/components/DeleteButton"
import { OpenButton } from "@/components/OpenButton"
import { GAME_STATUS_LABELS } from "@/constants/game"
import { useDeleteGame } from "@/hooks/games/useGameMutations"
import type { GameSummary } from "@/types/game"
import { GameDetailsView } from "./GameDetailsView"

export function AdminGameRow({ game }: { game: GameSummary }) {
  const deleteGame = useDeleteGame()

  return (
    <li className="card flex flex-col items-center gap-4 text-center transition duration-200 hover:-translate-y-1 motion-reduce:hover:translate-y-0">
      <div className="text-lg leading-snug font-bold break-words text-white">{game.title} · {GAME_STATUS_LABELS[game.status]}</div>
      <div className="flex flex-wrap justify-center gap-2">
        <div className="chip chip-gold">מנחה: {game.host.name}</div>
        <div className="chip">שאלות: {game.questionsCount} · משתתפים: {game.participantsCount}</div>
      </div>
      <div className="mt-auto flex w-full flex-wrap items-center justify-center gap-2 border-t border-white/10 pt-4">
        <OpenButton label="צפייה">{(close) => <GameDetailsView gameId={game.id} onClose={close} />}</OpenButton>
        <DeleteButton
          confirmText={`למחוק את "${game.title}" של ${game.host.name}?`}
          onConfirm={() => deleteGame.mutate(game.id)}
          isPending={deleteGame.isPending}
          error={deleteGame.error}
        />
      </div>
    </li>
  )
}
