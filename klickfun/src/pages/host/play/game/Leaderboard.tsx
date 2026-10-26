import type { LeaderboardRow } from "@/types/liveState"

export function Leaderboard({ rows }: { rows: LeaderboardRow[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>מקום</th>
          <th>שם</th>
          <th>נקודות</th>
          <th>תשובות נכונות</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.participantId}>
            <td>{row.rank}</td>
            <td>{row.name}</td>
            <td>{row.score}</td>
            <td>{row.correctCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
