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
    <section>
      <h2>המנצחים</h2>
      <ol>
        {winners.map((winner, i) => (
          <li key={winner.participantId}>
            {MEDALS[i]} {winner.name} · {winner.score} נקודות
          </li>
        ))}
      </ol>
      <h2>טבלת הניקוד</h2>
      <Leaderboard rows={leaderboard} />
      <LiveStepButton gameId={live.game.id} action={openLobbyApi} nextPage="lobby" label="שחק שוב" />
      <Link to={paths.myGames}>חזרה למשחקים שלי</Link>
    </section>
  )
}
