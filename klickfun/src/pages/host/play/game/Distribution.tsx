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
        <li className="flex flex-wrap items-center gap-4 px-6 py-4 text-lg font-bold rounded-2xl border border-[#A855F7]/20 bg-[#21104D]/50 transition duration-200 hover:border-[#A855F7]/45 hover:bg-[#21104D]/80" key={i}>
          {text}: {counts[i]} <progress className="h-3 min-w-32 flex-1 appearance-none overflow-hidden rounded-full [&::-moz-progress-bar]:bg-[#F03CFF] [&::-webkit-progress-bar]:bg-white/10 [&::-webkit-progress-value]:bg-linear-to-l [&::-webkit-progress-value]:from-[#F03CFF] [&::-webkit-progress-value]:to-[#00E5FF]" value={counts[i]} max={total || 1} />
        </li>
      ))}
    </ol>
  )
}
