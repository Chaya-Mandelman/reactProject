import type { LeaderboardRow } from "@/types/liveState"

export function Leaderboard({ rows }: { rows: LeaderboardRow[] }) {
  return (
    <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-3xl border border-[#A855F7]/30 bg-linear-to-b from-[#21104D]/90 to-[#140A38]/90 text-center text-sm tabular-nums shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9),0_0_40px_-22px_rgba(168,85,247,0.7)] backdrop-blur-xl sm:text-base">
      <thead className="bg-[#08051F]/50 text-xs tracking-wide text-[#C9BCEB]">
        <tr>
          <th className="border-b border-[#A855F7]/25 px-2 py-3 font-semibold sm:px-4">מקום</th>
          <th className="border-b border-[#A855F7]/25 px-2 py-3 font-semibold sm:px-4">שם</th>
          <th className="border-b border-[#A855F7]/25 px-2 py-3 font-semibold sm:px-4">נקודות</th>
          <th className="border-b border-[#A855F7]/25 px-2 py-3 font-semibold sm:px-4">תשובות נכונות</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr className="transition duration-200 hover:bg-[#A855F7]/10 [&:first-child]:bg-[#FFCA28]/[0.07] [&:nth-child(-n+3)>td:first-child]:text-[#FFCA28] [&:nth-child(-n+3)>td:first-child]:drop-shadow-[0_0_8px_rgba(255,202,40,0.7)] [&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-white/5" key={row.participantId}>
            <td className="px-2 py-3 text-lg font-black text-[#C9BCEB] sm:px-4">{row.rank}</td>
            <td className="px-2 py-3 font-semibold break-words text-white sm:px-4">{row.name}</td>
            <td className="px-2 py-3 text-lg font-black text-[#FFCA28] drop-shadow-[0_0_8px_rgba(255,202,40,0.45)] sm:px-4">{row.score}</td>
            <td className="px-2 py-3 font-semibold text-[#7DF3FF] sm:px-4">{row.correctCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
