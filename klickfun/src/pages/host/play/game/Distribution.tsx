import type { LiveQuestion } from "@/types/liveState"

type Props = {
  options: LiveQuestion["options"]
  counts: number[]
}

// התפלגות התשובות בסקר: כמה בחרו כל תשובה
export function Distribution({ options, counts }: Props) {
  const total = counts.reduce((sum, count) => sum + count, 0)

  return (
    <ol className="w-full space-y-3">
      {options.map((text, i) => (
        <li className="flex flex-wrap items-center gap-3 rounded-2xl border border-violet-400/40 bg-indigo-950/70 px-5 py-3 text-lg font-bold" key={i}>
          {text}: {counts[i]} <progress className="h-3 min-w-32 flex-1 appearance-none overflow-hidden rounded-full [&::-moz-progress-bar]:bg-fuchsia-500 [&::-webkit-progress-bar]:bg-white/10 [&::-webkit-progress-value]:bg-linear-to-l [&::-webkit-progress-value]:from-fuchsia-500 [&::-webkit-progress-value]:to-cyan-400" value={counts[i]} max={total || 1} />
        </li>
      ))}
    </ol>
  )
}
