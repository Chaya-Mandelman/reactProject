import type { LiveQuestion } from "@/types/liveState"
import type { OptionNumber } from "@/types/question"

type Props = {
  options: LiveQuestion["options"]
  correctOption?: OptionNumber | null
}

// 4 התשובות, לפי מקשי הטלפון 1-4. אם נשלחה תשובה נכונה היא מסומנת
export function OptionsList({ options, correctOption }: Props) {
  return (
    <ol className="grid w-full list-inside list-decimal gap-3 marker:font-black marker:text-[#00E5FF] sm:gap-4 md:grid-cols-2">
      {options.map((text, i) => (
        <li
          className={`flex min-h-16 items-center justify-center rounded-full border-2 border-transparent px-6 py-4 text-lg font-bold break-words text-white transition-all duration-200 ease-out motion-reduce:transition-none sm:text-xl lg:text-2xl ${correctOption === i + 1
            ? "scale-[1.02] [background:linear-gradient(180deg,#0F5132,#0A2E1F)_padding-box,linear-gradient(90deg,#22C55E,#86EFAC,#22C55E)_border-box] shadow-[0_4px_0_0_#064E3B,0_0_36px_rgba(34,197,94,0.6)] motion-reduce:scale-100"
            : "[background:linear-gradient(180deg,#2A1463,#140A38)_padding-box,linear-gradient(90deg,#F03CFF,#A855F7,#00E5FF)_border-box] shadow-[0_4px_0_0_#1a0b45,0_0_24px_rgba(168,85,247,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#1a0b45,0_0_34px_rgba(0,229,255,0.45)] motion-reduce:hover:translate-y-0"}`}
          key={i}
        >
          {text} {correctOption === i + 1 && "✓"}
        </li>
      ))}
    </ol>
  )
}
