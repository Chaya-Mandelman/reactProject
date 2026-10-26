import type { LiveQuestion } from "@/types/liveState"
import type { OptionNumber } from "@/types/question"

type Props = {
  options: LiveQuestion["options"]
  correctOption?: OptionNumber | null
}

// 4 התשובות, לפי מקשי הטלפון 1-4. אם נשלחה תשובה נכונה היא מסומנת
export function OptionsList({ options, correctOption }: Props) {
  return (
    <ol>
      {options.map((text, i) => (
        <li key={i}>
          {text} {correctOption === i + 1 && "✓"}
        </li>
      ))}
    </ol>
  )
}
