import type { LiveQuestion } from "@/types/liveState"

type Props = {
  options: LiveQuestion["options"]
  counts: number[]
}

// התפלגות התשובות בסקר: כמה בחרו כל תשובה
export function Distribution({ options, counts }: Props) {
  const total = counts.reduce((sum, count) => sum + count, 0)

  return (
    <ol className="w-full space-y-4">
      {options.map((text, i) => (
        <li className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border border-gold/45 bg-linear-to-b from-navy-2/95 to-navy/95 px-6 py-4 shadow-[inset_0_0_0_1px_rgb(63_208_255/0.15),0_0_20px_-8px_rgb(31_139_255/0.6)] text-start text-lg font-bold break-words text-white tabular-nums" key={i}>
          {text}: {counts[i]} <progress className="h-3 min-w-32 flex-1 basis-full appearance-none overflow-hidden rounded-full sm:basis-0 [&::-moz-progress-bar]:bg-cyan [&::-webkit-progress-bar]:bg-[#020a1f] [&::-webkit-progress-value]:bg-linear-to-l [&::-webkit-progress-value]:from-cyan [&::-webkit-progress-value]:to-blue [&::-webkit-progress-value]:shadow-[0_0_12px_rgb(63_208_255/0.8)]" value={counts[i]} max={total || 1} />
        </li>
      ))}
    </ol>
  )
}
