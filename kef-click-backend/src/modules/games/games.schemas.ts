import { z } from 'zod';
import { normalizePhone } from '../../utils/phone';

/** מזהה מספרי בכתובת (/:id) */
export const idParam = z.coerce
  .number({ invalid_type_error: 'מזהה לא תקין' })
  .int('מזהה לא תקין')
  .positive('מזהה לא תקין');

export const GAME_STATUSES = ['SETUP', 'LOBBY', 'RUNNING', 'PAUSED', 'FINISHED'] as const;

export const gameListQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  status: z.enum(GAME_STATUSES, { errorMap: () => ({ message: 'סטטוס לא תקין' }) }).optional(),
  sort: z
    .enum(['newest', 'oldest', 'title'], { errorMap: () => ({ message: 'מיון לא תקין (newest / oldest / title)' }) })
    .default('newest'),
});
export type GameListQuery = z.infer<typeof gameListQuerySchema> & { hostId?: number };

const title = z.string({ required_error: 'שם המשחק חובה' }).trim().min(2, 'שם המשחק קצר מדי').max(100, 'שם המשחק ארוך מדי');
const description = z.string().trim().max(500, 'התיאור ארוך מדי').nullable().optional();

export const createGameSchema = z.object({ title, description });
export const updateGameSchema = z
  .object({ title: title.optional(), description })
  .refine((v) => Object.keys(v).length > 0, { message: 'יש לשלוח לפחות שדה אחד לעדכון' });

// ===== משתתפים =====
const participantName = z.string({ required_error: 'שם המשתתף חובה' }).trim().min(2, 'שם קצר מדי').max(60, 'שם ארוך מדי');
const phone = z
  .string({ required_error: 'טלפון חובה' })
  .transform((v, ctx) => {
    const p = normalizePhone(v);
    if (!p) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'מספר טלפון לא תקין (לדוגמה 0501234567)' });
      return z.NEVER;
    }
    return p;
  });

export const createParticipantSchema = z.object({ name: participantName, phone });
export const updateParticipantSchema = z
  .object({ name: participantName.optional(), phone: phone.optional() })
  .refine((v) => Object.keys(v).length > 0, { message: 'יש לשלוח לפחות שדה אחד לעדכון' });

// ===== שאלות =====
const option = (n: number) =>
  z.string({ required_error: `תשובה ${n} חובה` }).trim().min(1, `תשובה ${n} חובה`).max(120, `תשובה ${n} ארוכה מדי`);

const questionFields = {
  type: z.enum(['COMPETITIVE', 'POLL'], { errorMap: () => ({ message: 'סוג שאלה: COMPETITIVE או POLL' }) }),
  text: z.string({ required_error: 'נוסח השאלה חובה' }).trim().min(2, 'השאלה קצרה מדי').max(300, 'השאלה ארוכה מדי'),
  option1: option(1),
  option2: option(2),
  option3: option(3),
  option4: option(4),
  correctOption: z
    .number({ invalid_type_error: 'התשובה הנכונה חייבת להיות מספר 1 עד 4' })
    .int()
    .min(1, 'התשובה הנכונה: 1 עד 4')
    .max(4, 'התשובה הנכונה: 1 עד 4')
    .nullable()
    .optional(),
};

export const createQuestionSchema = z.object({ ...questionFields, type: questionFields.type.default('COMPETITIVE') });
export const updateQuestionSchema = z
  .object({
    type: questionFields.type.optional(),
    text: questionFields.text.optional(),
    option1: questionFields.option1.optional(),
    option2: questionFields.option2.optional(),
    option3: questionFields.option3.optional(),
    option4: questionFields.option4.optional(),
    correctOption: questionFields.correctOption,
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'יש לשלוח לפחות שדה אחד לעדכון' });

/**
 * בדיקה של שאלה שלמה (אחרי מיזוג עם הערכים הקיימים בעדכון):
 * תחרותית — חובה תשובה נכונה; סקר — אסור; 4 תשובות שונות זו מזו.
 */
export const fullQuestionSchema = z
  .object({
    type: questionFields.type,
    text: questionFields.text,
    option1: questionFields.option1,
    option2: questionFields.option2,
    option3: questionFields.option3,
    option4: questionFields.option4,
    correctOption: z.number().int().min(1).max(4).nullable(),
  })
  .superRefine((q, ctx) => {
    if (q.type === 'COMPETITIVE' && q.correctOption === null) {
      ctx.addIssue({ code: 'custom', path: ['correctOption'], message: 'בשאלה תחרותית חובה לבחור תשובה נכונה (1 עד 4)' });
    }
    if (q.type === 'POLL' && q.correctOption !== null) {
      ctx.addIssue({ code: 'custom', path: ['correctOption'], message: 'בשאלת סקר אין תשובה נכונה' });
    }
    const opts = [q.option1, q.option2, q.option3, q.option4].map((o) => o.trim().toLowerCase());
    if (new Set(opts).size !== 4) {
      ctx.addIssue({ code: 'custom', path: ['option1'], message: 'ארבע התשובות חייבות להיות שונות זו מזו' });
    }
  });

export const reorderQuestionsSchema = z.object({
  questionIds: z.array(z.number().int().positive(), { required_error: 'questionIds חובה' }).min(1, 'רשימה ריקה'),
});

export type CreateGameInput = z.infer<typeof createGameSchema>;
export type UpdateGameInput = z.infer<typeof updateGameSchema>;
export type CreateParticipantInput = z.infer<typeof createParticipantSchema>;
export type UpdateParticipantInput = z.infer<typeof updateParticipantSchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
