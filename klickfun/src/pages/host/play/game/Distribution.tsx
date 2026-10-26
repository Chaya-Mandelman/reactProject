import type { LiveQuestion } from "@/types/liveState"

type Props = {
  options: LiveQuestion["options"]
  counts: number[]
}

// התפלגות התשובות בסקר: כמה בחרו כל תשובה
export function Distribution({ options, counts }: Props) {
  const total = counts.reduce((sum, count) => sum + count, 0)

  return (
    <ol>
      {options.map((text, i) => (
        <li key={i}>
          {text}: {counts[i]} <progress value={counts[i]} max={total || 1} />
        </li>
      ))}
    </ol>
  )
}
