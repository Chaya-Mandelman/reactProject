import type { CSSProperties } from "react"
import { useCountUp } from "@/hooks/gameRun/useCountUp"
import type { LeaderboardRow } from "@/types/liveState"
import styles from "./Wow.module.css"

type Props = {
  rows: LeaderboardRow[]
  // הטבלה הקודמת: כל שורה גולשת מהמקום הקודם שלה, והניקוד רץ מהניקוד הקודם
  previous?: LeaderboardRow[]
  // אחרי כמה זמן מתחילה התנועה
  animateFromMs?: number
}

export function Leaderboard({ rows, previous, animateFromMs = 0 }: Props) {
  const before = new Map(previous?.map((row) => [row.participantId, row]))

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
          <Row key={row.participantId} row={row} before={previous ? before.get(row.participantId) : undefined} delayMs={animateFromMs} />
        ))}
      </tbody>
    </table>
  )
}

function Row({ row, before, delayMs }: { row: LeaderboardRow; before?: LeaderboardRow; delayMs: number }) {
  // כמה מקומות עלתה (חיובי) או ירדה (שלילי) מאז השאלה הקודמת
  const moved = before ? before.rank - row.rank : 0
  const score = useCountUp(row.score, before?.score ?? row.score, 1300, delayMs)
  const style = { "--d": moved, "--delay": `${delayMs}ms` } as CSSProperties

  return (
    <tr
      className={`transition duration-200 even:bg-navy-2/30 hover:bg-cyan/5 [&:not(:last-child)>td]:border-b [&:not(:last-child)>td]:border-cyan/10 [&:nth-child(-n+3)>td:first-child]:text-gold ${before ? styles.moveRow : ""}`}
      style={style}
    >
      <td className="px-2 py-3 text-lg font-black text-muted sm:px-4">
        {row.rank}
        {moved > 0 && <span className={styles.up} style={style} aria-label={`עלתה ${moved}`}>▲{moved}</span>}
        {moved < 0 && <span className={styles.down} style={style} aria-label={`ירדה ${-moved}`}>▼{-moved}</span>}
      </td>
      <td className="px-2 py-3 font-bold break-words text-white sm:px-4">
        {row.rank === 1 && row.score > 0 && <span className={styles.crown} aria-hidden="true">👑</span>}
        {row.name}
      </td>
      <td className="px-2 py-3 text-lg font-black text-gold sm:px-4">{score}</td>
      <td className="px-2 py-3 font-semibold text-cyan sm:px-4">{row.correctCount}</td>
    </tr>
  )
}
