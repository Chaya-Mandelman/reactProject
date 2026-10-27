import type { LiveQuestion } from "@/types/liveState"
import type { OptionNumber } from "@/types/question"

type Props = {
  options: LiveQuestion["options"]
  correctOption?: OptionNumber | null
}

// 4 התשובות, לפי מקשי הטלפון 1-4. אם נשלחה תשובה נכונה היא מסומנת
export function OptionsList({ options, correctOption }: Props) {
  return (
    <ol className="grid w-full gap-x-6 gap-y-5 [counter-reset:option] md:grid-cols-2">
      {options.map((text, i) => (
        <li
          className={`option ${correctOption === i + 1 ? "option-correct" : correctOption ? "opacity-40 saturate-50" : ""}`}
          key={i}
        >
          {text} {correctOption === i + 1 && "✓"}
        </li>
      ))}
    </ol>
  )
}
