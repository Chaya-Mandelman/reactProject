import type { GameSummary } from "../../../types/game"
import { GameLinks } from "./GameLinks"
import { GameActions } from "./GameActions"

export function GameCard({ game }: { game: GameSummary }) {
  return (
    <li>
      <div>שם המשחק: {game.title}</div>
      <div>מצב: {game.status}</div>
      {game.description && <div>תיאור: {game.description}</div>}
      <div>כמות משתתפים: {game.participantsCount}</div>
      <div>כמות שאלות: {game.questionsCount}</div>
      <GameLinks gameId={game.id} />
      <GameActions game={game} />
    </li>
  )
}
