import { Link } from "react-router"
import { openLobbyApi } from "@/api/gameRun"
import { LiveStepButton } from "@/components/LiveStepButton"
import { paths } from "@/constants/routes"
import type { LiveFinishedState } from "@/types/liveState"
import { Leaderboard } from "./Leaderboard"

const MEDALS = ["🥇", "🥈", "🥉"]

// "שחק שוב" פותח לובי חדש: השרת מאפס את התשובות והניקוד
export function SummaryView({ live }: { live: LiveFinishedState }) {
  const { winners, leaderboard } = live.summary

  return (
    <section className="flex flex-col items-center gap-8">
      <h2 className="text-3xl font-black bg-linear-to-b from-[#FFF3C4] via-[#FFCA28] to-[#F5A300] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(255,202,40,0.45)]">המנצחים</h2>
      <ol className="flex flex-wrap items-end justify-center gap-4">
        {winners.map((winner, i) => (
          <li className="min-w-44 rounded-3xl border border-[#FFCA28]/40 bg-linear-to-b from-[#FFCA28]/20 to-[#140A38]/90 px-6 py-6 text-lg font-extrabold tabular-nums break-words text-white backdrop-blur-xl shadow-[0_0_30px_-6px_rgba(255,202,40,0.5)] first:order-2 first:scale-110 first:border-[#FFE082] first:py-9 first:shadow-[0_0_44px_-4px_rgba(255,202,40,0.75)] [&:nth-child(2)]:order-1 [&:nth-child(3)]:order-3" key={winner.participantId}>
            {MEDALS[i]} {winner.name} · {winner.score} נקודות
          </li>
        ))}
      </ol>
      <h2 className="text-3xl font-black bg-linear-to-b from-[#FFF3C4] via-[#FFCA28] to-[#F5A300] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(255,202,40,0.45)]">טבלת הניקוד</h2>
      <Leaderboard rows={leaderboard} />
      <LiveStepButton gameId={live.game.id} action={openLobbyApi} nextPage="lobby" label="שחק שוב" />
      <Link className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-40 h-11 px-6 text-sm border border-[#00E5FF]/30 bg-[#140A38]/80 text-[#C9BCEB] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[#00E5FF]/70 hover:bg-[#00E5FF]/10 hover:text-white hover:shadow-[0_0_18px_-4px_rgba(0,229,255,0.6)]" to={paths.myGames}>חזרה למשחקים שלי</Link>
    </section>
  )
}
