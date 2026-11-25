import type { LiveQuestion } from "@/types/liveState"
import type { OptionNumber } from "@/types/question"
import styles from "./Wow.module.css"

type Props = {
  options: LiveQuestion["options"]
  correctOption?: OptionNumber | null
  // ברגע החשיפה: התשובה הנכונה מתנפחת עם הילה
  celebrate?: boolean
}

// 4 התשובות, לפי מקשי הטלפון 1-4. אם נשלחה תשובה נכונה היא מסומנת
export function OptionsList({ options, correctOption, celebrate = false }: Props) {
  return (
    <ol className="grid w-full gap-x-6 gap-y-5 [counter-reset:option] md:grid-cols-2">
      {options.map((text, i) => (
        <li
          className={`option ${correctOption === i + 1 ? `option-correct ${celebrate ? styles.correctBurst : ""}` : correctOption ? "opacity-40 saturate-50" : ""}`}
          key={i}
        >
          {text} {correctOption === i + 1 && "✓"}
        </li>
      ))}
    </ol>
  )
}
