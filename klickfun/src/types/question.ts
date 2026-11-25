export type QuestionType = "COMPETITIVE" | "POLL"

export type OptionNumber = 1 | 2 | 3 | 4

export interface Question {
  id: number
  order: number
  type: QuestionType
  text: string
  option1: string
  option2: string
  option3: string
  option4: string
  // בסקר אין תשובה נכונה
  correctOption: OptionNumber | null
  // מזהה התמונה של השאלה, או null אם אין
  imageId: string | null
}

// מה שנשלח בהוספה ובעריכה (התמונה נשלחת בנפרד)
export type QuestionInput = Omit<Question, "id" | "order" | "imageId">

// מה לעשות עם התמונה בשמירת השאלה
export type ImageChange = { kind: "keep" } | { kind: "set"; blob: Blob; previewUrl: string } | { kind: "remove" }
