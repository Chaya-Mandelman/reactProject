import { DeleteButton } from "@/components/DeleteButton"
import { OpenButton } from "@/components/OpenButton"
import { GAME_STATUS_LABELS } from "@/constants/game"
import { useDeleteGame } from "@/hooks/games/useGameMutations"
import type { GameSummary } from "@/types/game"
import { GameDetailsView } from "./GameDetailsView"

export function AdminGameRow({ game }: { game: GameSummary }) {
  const deleteGame = useDeleteGame()

  return (
    <li className="rounded-3xl border-2 border-fuchsia-400/50 bg-indigo-950/70 p-6 shadow-[0_0_30px_rgba(168,85,247,0.35),inset_0_0_30px_rgba(168,85,247,0.15)] backdrop-blur-md flex flex-col items-start gap-2 transition duration-300 hover:-translate-y-1 hover:border-fuchsia-300">
      <div className="text-xl font-extrabold text-amber-200">{game.title} · {GAME_STATUS_LABELS[game.status]}</div>
      <div className="text-sm text-violet-200">מנחה: {game.host.name}</div>
      <div className="text-sm text-violet-300">שאלות: {game.questionsCount} · משתתפים: {game.participantsCount}</div>
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
