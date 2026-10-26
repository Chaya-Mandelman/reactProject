import { GAME_STATUS_LABELS } from "@/constants/game"
import type { GameSummary } from "@/types/game"
import { GameActions } from "./GameActions"
import { GameLinks } from "./GameLinks"

export function GameCard({ game }: { game: GameSummary }) {
  return (
    <li className="rounded-3xl border-2 border-fuchsia-400/50 bg-indigo-950/70 p-6 shadow-[0_0_30px_rgba(168,85,247,0.35),inset_0_0_30px_rgba(168,85,247,0.15)] backdrop-blur-md flex flex-col gap-2 transition duration-300 hover:-translate-y-1 hover:border-fuchsia-300 hover:shadow-[0_0_40px_rgba(217,70,239,0.5)]">
      <div className="text-xl font-extrabold text-amber-200">שם המשחק: {game.title}</div>
      <div className="w-fit rounded-full border border-cyan-400/60 bg-cyan-400/10 px-3 py-0.5 text-sm font-semibold text-cyan-200">מצב: {GAME_STATUS_LABELS[game.status]}</div>
      {game.description && <div className="text-sm text-violet-200/90">תיאור: {game.description}</div>}
      <div className="text-sm text-violet-300">כמות משתתפים: {game.participantsCount}</div>
      <div className="text-sm text-violet-300">כמות שאלות: {game.questionsCount}</div>
      <GameLinks gameId={game.id} status={game.status} />
      <GameActions game={game} />
    </li>
  )
}
