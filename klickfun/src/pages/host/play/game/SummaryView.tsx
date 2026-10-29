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
    <section className="relative isolate mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
      <img className="pointer-events-none absolute inset-x-0 -top-8 -z-10 w-full opacity-70" src="/confetti.svg" alt="" aria-hidden="true" />
      <div className="cta flex flex-wrap items-center justify-center gap-3">
        <LiveStepButton gameId={live.game.id} action={openLobbyApi} to={paths.play(live.game.id, "lobby")} label="שחק שוב" />
        <Link className="btn btn-ghost h-14 px-8" to={paths.myGames}>חזרה למשחקים שלי</Link>
      </div>
      <img className="size-24 drop-shadow-[0_0_30px_rgb(247_201_72/0.6)] sm:size-32" src="/trophy.svg" alt="" aria-hidden="true" />
      
      <h2 className="gold-text -mt-4 text-5xl sm:text-6xl">המנצחים</h2>
      <ol className="flex w-full flex-wrap items-end justify-center gap-5">
        {winners.map((winner, i) => (
          <li className="frame-panel min-w-44 px-7 pt-7 pb-9 text-lg font-black break-words text-white tabular-nums first:order-2 first:pt-10 first:pb-16 first:text-2xl first:text-gold first:drop-shadow-[0_0_30px_rgb(247_201_72/0.45)] [&:nth-child(2)]:order-1 [&:nth-child(2)]:pb-12 [&:nth-child(3)]:order-3" key={winner.participantId}>
            {MEDALS[i]} {winner.name} · {winner.score} נקודות
          </li>
        ))}
      </ol>
      <h2 className="section-title mt-4 mb-0 text-2xl">טבלת הניקוד</h2>
      <Leaderboard rows={leaderboard} />
      
    </section>
  )
}
