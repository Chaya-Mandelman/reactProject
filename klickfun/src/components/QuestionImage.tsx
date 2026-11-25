import { imageUrl } from "@/api/questions"

type Props = { imageId: string | null; className?: string }

// התמונה של השאלה, אם יש. מציגים אותה כולה (object-contain) כדי לא לחתוך
export function QuestionImage({ imageId, className = "max-h-[40vh]" }: Props) {
  if (!imageId) return null
  return <img className={`mx-auto w-auto max-w-full rounded-2xl border border-white/10 object-contain shadow-lg ${className}`} src={imageUrl(imageId)} alt="תמונה לשאלה" />
}
