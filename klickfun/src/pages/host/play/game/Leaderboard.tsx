import type { LeaderboardRow } from "@/types/liveState"

export function Leaderboard({ rows }: { rows: LeaderboardRow[] }) {
  return (
    <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-2xl border-2 border-fuchsia-400/50 bg-indigo-950/70 text-center shadow-[0_0_24px_rgba(168,85,247,0.35)]">
      <thead className="bg-fuchsia-600/30 text-sm text-fuchsia-100">
        <tr>
          <th className="px-4 py-3 font-bold">מקום</th>
          <th className="px-4 py-3 font-bold">שם</th>
          <th className="px-4 py-3 font-bold">נקודות</th>
          <th className="px-4 py-3 font-bold">תשובות נכונות</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr className="transition odd:bg-white/5 hover:bg-cyan-400/10" key={row.participantId}>
            <td className="px-4 py-2.5 text-lg font-black text-amber-300">{row.rank}</td>
            <td className="px-4 py-2.5 font-semibold">{row.name}</td>
            <td className="px-4 py-2.5 font-black text-amber-200">{row.score}</td>
            <td className="px-4 py-2.5 text-cyan-200">{row.correctCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
