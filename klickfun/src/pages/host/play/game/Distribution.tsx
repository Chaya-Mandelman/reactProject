import type { CSSProperties } from "react"
import { useCountUp } from "@/hooks/gameRun/useCountUp"
import type { LiveQuestion } from "@/types/liveState"
import styles from "./Wow.module.css"

type Props = {
  options: LiveQuestion["options"]
  counts: number[]
}

// התפלגות התשובות בסקר: העמודות צומחות אחת אחרי השנייה, והמספרים רצים
export function Distribution({ options, counts }: Props) {
  const total = counts.reduce((sum, count) => sum + count, 0)

  return (
    <ol className="w-full space-y-4">
      {options.map((text, i) => (
        <DistributionRow key={i} text={text} count={counts[i] ?? 0} total={total} index={i} />
      ))}
    </ol>
  )
}

function DistributionRow({ text, count, total, index }: { text: string; count: number; total: number; index: number }) {
  const delayMs = 200 + index * 250
  const shown = useCountUp(count, 0, 1100, delayMs)
  const percent = total ? Math.round((count / total) * 100) : 0
  const style = { "--w": `${percent}%`, "--delay": `${delayMs}ms` } as CSSProperties

  return (
    <li className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border border-gold/45 bg-linear-to-b from-navy-2/95 to-navy/95 px-6 py-4 shadow-[inset_0_0_0_1px_rgb(63_208_255/0.15),0_0_20px_-8px_rgb(31_139_255/0.6)] text-start text-lg font-bold break-words text-white tabular-nums">
      {text}: {shown}
      <span className={styles.bar} role="img" aria-label={`${count} מתוך ${total}`}>
        <span className={styles.barFill} style={style} />
      </span>
    </li>
  )
}
