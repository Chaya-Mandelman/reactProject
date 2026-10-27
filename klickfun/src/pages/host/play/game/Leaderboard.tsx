import type { LeaderboardRow } from "@/types/liveState"

export function Leaderboard({ rows }: { rows: LeaderboardRow[] }) {
  return (
    <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-xl border border-gold/50 bg-[#020a1f]/90 text-center text-sm tabular-nums shadow-[0_0_30px_-10px_rgb(247_201_72/0.5)] sm:text-base">
      <thead className="bg-linear-to-b from-[#2a1d00] to-[#120c00] text-xs text-gold">
        <tr>
          <th className="border-b border-gold/40 px-2 py-3 font-bold sm:px-4">מקום</th>
          <th className="border-b border-gold/40 px-2 py-3 font-bold sm:px-4">שם</th>
          <th className="border-b border-gold/40 px-2 py-3 font-bold sm:px-4">נקודות</th>
          <th className="border-b border-gold/40 px-2 py-3 font-bold sm:px-4">תשובות נכונות</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr className="transition duration-200 even:bg-navy-2/30 hover:bg-cyan/5 [&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-cyan/10 [&:nth-child(-n+3)>td:first-child]:text-gold" key={row.participantId}>
            <td className="px-2 py-3 text-lg font-black text-muted sm:px-4">{row.rank}</td>
            <td className="px-2 py-3 font-bold break-words text-white sm:px-4">{row.name}</td>
            <td className="px-2 py-3 text-lg font-black text-gold sm:px-4">{row.score}</td>
            <td className="px-2 py-3 font-semibold text-cyan sm:px-4">{row.correctCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
