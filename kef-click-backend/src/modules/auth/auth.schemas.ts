import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string({ required_error: 'אימייל חובה' }).trim().toLowerCase().email('אימייל לא תקין'),
  password: z.string({ required_error: 'סיסמה חובה' }).min(1, 'סיסמה חובה'),
});

/** חוקי סיסמה — משותפים להרשמה וליצירת מנחה ע"י מנהל */
export const passwordSchema = z
  .string({ required_error: 'סיסמה חובה' })
  .min(8, 'סיסמה חייבת להיות לפחות 8 תווים')
  .max(72, 'סיסמה ארוכה מדי')
  .regex(/[A-Za-z]/, 'סיסמה חייבת לכלול לפחות אות אחת באנגלית')
  .regex(/\d/, 'סיסמה חייבת לכלול לפחות ספרה אחת');

/** הרשמה עצמית — תמיד כמנחה. שדה role, אם נשלח, פשוט לא נקרא. */
export const registerSchema = z.object({
  name: z.string({ required_error: 'שם חובה' }).trim().min(2, 'שם קצר מדי').max(80, 'שם ארוך מדי'),
  email: z.string({ required_error: 'אימייל חובה' }).trim().toLowerCase().email('אימייל לא תקין').max(120),
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
