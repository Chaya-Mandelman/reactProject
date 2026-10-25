/**
 * המרת מספר טלפון לפורמט אחיד: ספרות בלבד, מתחיל ב-0.
 * "+972-50-123-4567" → "0501234567", "050 123 4567" → "0501234567"
 * מחזיר null אם המספר לא נראה כמו מספר ישראלי תקין.
 */
export function normalizePhone(input: string): string | null {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('972')) digits = `0${digits.slice(3)}`;
  if (!digits.startsWith('0')) digits = `0${digits}`;
  // נייד: 10 ספרות (05X...), נייח: 9 ספרות (02/03/04/08/09), 07X: 10 ספרות
  if (!/^0\d{8,9}$/.test(digits)) return null;
  return digits;
}
