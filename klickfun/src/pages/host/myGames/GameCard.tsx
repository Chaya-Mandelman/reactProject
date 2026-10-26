import { GAME_STATUS_LABELS } from "@/constants/game"
import type { GameSummary } from "@/types/game"
import { GameActions } from "./GameActions"
import { GameLinks } from "./GameLinks"

export function GameCard({ game }: { game: GameSummary }) {
  return (
    <li>
      <div>שם המשחק: {game.title}</div>
      <div>מצב: {GAME_STATUS_LABELS[game.status]}</div>
      {game.description && <div>תיאור: {game.description}</div>}
      <div>כמות משתתפים: {game.participantsCount}</div>
      <div>כמות שאלות: {game.questionsCount}</div>
      <GameLinks gameId={game.id} status={game.status} />
      <GameActions game={game} />
    </li>
  )
}
