import { GAME_STATUS_LABELS } from "@/constants/game"
import type { GameSummary } from "@/types/game"
import { GameActions } from "./GameActions"
import { GameLinks } from "./GameLinks"

export function GameCard({ game }: { game: GameSummary }) {
  return (
    <li className="card flex flex-col items-center gap-4 text-center transition duration-200 hover:-translate-y-1 motion-reduce:hover:translate-y-0">
      <div>
        <div className="text-lg leading-snug font-bold break-words text-white"><span className="sr-only">שם המשחק: </span>{game.title}</div>
        {game.description && <div className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted/70"><span className="sr-only">תיאור: </span>{game.description}</div>}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <div className="chip chip-cyan">מצב: {GAME_STATUS_LABELS[game.status]}</div>
        <div className="chip">כמות משתתפים: {game.participantsCount}</div>
        <div className="chip">כמות שאלות: {game.questionsCount}</div>
      </div>
      <GameLinks gameId={game.id} status={game.status} />
      <GameActions game={game} />
    </li>
  )
}
