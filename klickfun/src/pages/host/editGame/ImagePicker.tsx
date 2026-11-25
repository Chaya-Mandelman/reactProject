import { useState, type ChangeEvent } from "react"
import { imageUrl } from "@/api/questions"
import type { ImageChange } from "@/types/question"
import { prepareImage, toDataUrl } from "@/utils/image"

type Props = {
  // התמונה שכבר שמורה בשאלה
  currentImageId: string | null
  value: ImageChange
  onChange: (image: ImageChange) => void
  disabled?: boolean
}

// בחירת תמונה לשאלה: תצוגה מקדימה, החלפה והסרה. השמירה עצמה קורית עם שמירת השאלה
export function ImagePicker({ currentImageId, value, onChange, disabled }: Props) {
  const [preparing, setPreparing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const shownUrl = value.kind === "set" ? value.previewUrl : value.kind === "keep" && currentImageId ? imageUrl(currentImageId) : null

  const pick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = "" // כדי שאפשר יהיה לבחור שוב את אותו קובץ
    if (!file) return
    setError(null)
    setPreparing(true)
    try {
      const blob = await prepareImage(file)
      onChange({ kind: "set", blob, previewUrl: await toDataUrl(blob) })
    } catch (e) {
      setError(e instanceof Error ? e.message : "לא הצלחנו לטעון את התמונה")
    } finally {
      setPreparing(false)
    }
  }

  return (
    <div className="flex w-full flex-wrap items-center gap-3">
      {shownUrl && <img className="max-h-40 rounded-lg border border-white/10 object-contain" src={shownUrl} alt="התמונה של השאלה" />}
      <label className={`btn btn-sm btn-ghost ${disabled || preparing ? "pointer-events-none opacity-60" : "cursor-pointer"}`}>
        {preparing ? "מכינה תמונה..." : shownUrl ? "החלפת תמונה" : "🖼 הוספת תמונה (לא חובה)"}
        <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={pick} disabled={disabled || preparing} />
      </label>
      {shownUrl && (
        <button className="btn btn-sm btn-ghost" type="button" disabled={disabled} onClick={() => onChange(currentImageId ? { kind: "remove" } : { kind: "keep" })}>
          הסרת תמונה
        </button>
      )}
      {error && <span className="field-error block basis-full" role="alert">{error}</span>}
    </div>
  )
}
