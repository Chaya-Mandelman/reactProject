import { z } from "zod"

export const loginSchema = z.object({
  email: z.email("כתובת מייל לא תקינה"),
  password: z.string().min(6, "סיסמה של 6 תווים לפחות").max(100, "הסיסמה ארוכה מדי"),
})

export const registerSchema = loginSchema.extend({
  name: z.string().trim().min(2, "השם קצר מדי").max(100, "השם ארוך מדי"),
})
