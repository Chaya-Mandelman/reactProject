// הקטנת תמונה בדפדפן לפני ההעלאה: צלע ארוכה עד 1600 פיקסלים ועד 2MB
const MAX_SIDE = 1600
const MAX_BYTES = 2 * 1024 * 1024
const QUALITIES = [0.85, 0.7, 0.55]

const toBlob = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality))

export async function prepareImage(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) throw new Error("יש לבחור קובץ תמונה")

  // GIF נשאר כמו שהוא, כדי לא לאבד את האנימציה
  if (file.type === "image/gif") {
    if (file.size > MAX_BYTES) throw new Error("קובץ GIF גדול מדי (עד 2MB)")
    return file
  }

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error("לא הצלחנו לקרוא את התמונה. נסי קובץ JPG או PNG")
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  for (const quality of QUALITIES) {
    let blob = await toBlob(canvas, "image/webp", quality)
    // דפדפן שלא יודע לשמור WEBP מחזיר PNG. אז שומרים JPG
    if (blob?.type !== "image/webp") blob = await toBlob(canvas, "image/jpeg", quality)
    if (blob && blob.size <= MAX_BYTES) return blob
  }
  throw new Error("התמונה גדולה מדי גם אחרי הקטנה")
}

// תצוגה מקדימה של תמונה שעוד לא נשמרה
export const toDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error("לא הצלחנו להציג את התמונה"))
    reader.readAsDataURL(blob)
  })
