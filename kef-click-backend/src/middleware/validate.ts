import type { ZodType, ZodTypeDef } from 'zod';
import { HttpError } from '../utils/HttpError';

/**
 * בדיקת קלט מול סכמת Zod.
 * אם הקלט לא תקין — נזרקת שגיאת 400 עם פירוט לכל שדה.
 */
export function parse<T>(schema: ZodType<T, ZodTypeDef, unknown>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const fields = result.error.issues.map((issue) => ({
      field: issue.path.join('.') || '(root)',
      message: issue.message,
    }));
    throw HttpError.badRequest('הנתונים שנשלחו אינם תקינים', fields);
  }
  return result.data;
}
