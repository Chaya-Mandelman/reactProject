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
    <section className="flex flex-col items-center gap-6">
      <h2 className="text-3xl font-black text-amber-300 drop-shadow-[0_0_16px_rgba(251,191,36,0.6)]">המנצחים</h2>
      <ol className="flex flex-wrap items-end justify-center gap-4">
        {winners.map((winner, i) => (
          <li className="rounded-3xl border-2 border-amber-300/70 bg-linear-to-b from-amber-400/25 to-indigo-950/80 px-6 py-5 text-xl font-extrabold shadow-[0_0_30px_rgba(251,191,36,0.45)] first:scale-110 first:border-amber-200" key={winner.participantId}>
            {MEDALS[i]} {winner.name} · {winner.score} נקודות
          </li>
        ))}
      </ol>
      <h2 className="text-3xl font-black text-amber-300 drop-shadow-[0_0_16px_rgba(251,191,36,0.6)]">טבלת הניקוד</h2>
      <Leaderboard rows={leaderboard} />
      <LiveStepButton gameId={live.game.id} action={openLobbyApi} nextPage="lobby" label="שחק שוב" />
      <Link className="cursor-pointer rounded-full font-bold transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100 border-2 border-cyan-400/70 bg-cyan-400/5 px-5 py-2 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.35)] hover:bg-cyan-400/15 hover:shadow-[0_0_22px_rgba(34,211,238,0.6)]" to={paths.myGames}>חזרה למשחקים שלי</Link>
    </section>
  )
}
