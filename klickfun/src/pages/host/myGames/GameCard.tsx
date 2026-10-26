import { GAME_STATUS_LABELS } from "@/constants/game"
import type { GameSummary } from "@/types/game"
import { GameActions } from "./GameActions"
import { GameLinks } from "./GameLinks"

export function GameCard({ game }: { game: GameSummary }) {
  return (
    <li className="rounded-3xl border border-[#A855F7]/30 bg-linear-to-b from-[#21104D]/90 to-[#140A38]/90 p-5 sm:p-6 text-start shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9),0_0_40px_-22px_rgba(168,85,247,0.7)] ring-1 ring-inset ring-white/5 backdrop-blur-xl group relative flex flex-wrap content-start items-center gap-2 overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-[#F03CFF]/40 hover:shadow-[0_24px_50px_-18px_rgba(240,60,255,0.6)] before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-linear-to-l before:from-[#F03CFF] before:via-[#00E5FF] before:to-[#FFCA28] before:shadow-[0_0_14px_rgba(0,229,255,0.8)]">
      <div className="mb-1 w-full text-lg font-bold leading-snug text-white">שם המשחק: {game.title}</div>
      <div className="rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset bg-[#00E5FF]/10 text-[#7DF3FF] ring-[#00E5FF]/35">מצב: {GAME_STATUS_LABELS[game.status]}</div>
      {game.description && <div className="order-1 mt-2 line-clamp-2 w-full text-sm leading-relaxed text-[#C9BCEB]/70">תיאור: {game.description}</div>}
      <div className="rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset bg-[#140A38]/80 text-[#C9BCEB] ring-[#A855F7]/25">כמות משתתפים: {game.participantsCount}</div>
      <div className="rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset bg-[#140A38]/80 text-[#C9BCEB] ring-[#A855F7]/25">כמות שאלות: {game.questionsCount}</div>
      <GameLinks gameId={game.id} status={game.status} />
      <GameActions game={game} />
    </li>
  )
}
