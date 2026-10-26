import type { LiveQuestion } from "@/types/liveState"
import type { OptionNumber } from "@/types/question"

type Props = {
  options: LiveQuestion["options"]
  correctOption?: OptionNumber | null
}

// 4 התשובות, לפי מקשי הטלפון 1-4. אם נשלחה תשובה נכונה היא מסומנת
export function OptionsList({ options, correctOption }: Props) {
  return (
    <ol className="grid w-full list-inside list-decimal gap-4 marker:text-cyan-300 sm:grid-cols-2">
      {options.map((text, i) => (
        <li className="rounded-full border-2 border-fuchsia-400/70 bg-indigo-950/80 px-6 py-4 text-center text-xl font-bold text-white shadow-[0_0_18px_rgba(217,70,239,0.4)] transition hover:border-cyan-300 hover:shadow-[0_0_24px_rgba(34,211,238,0.6)]" key={i}>
          {text} {correctOption === i + 1 && "✓"}
        </li>
      ))}
    </ol>
  )
}
