import { z } from 'zod';
import { fullQuestionSchema } from '../games/games.schemas';
import { aiProvider } from './ai.provider';

export const MAX_AI_QUESTIONS = 20;

export const generateQuestionsSchema = z.object({
  topic: z.string({ required_error: 'נושא חובה' }).trim().min(2, 'הנושא קצר מדי').max(200, 'הנושא ארוך מדי'),
  count: z.coerce.number().int().min(1, 'לפחות שאלה אחת').max(MAX_AI_QUESTIONS, `עד ${MAX_AI_QUESTIONS} שאלות`).default(5),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD'], { errorMap: () => ({ message: 'רמת קושי: EASY / MEDIUM / HARD' }) }).default('MEDIUM'),
  kind: z.enum(['COMPETITIVE', 'POLL', 'MIXED'], { errorMap: () => ({ message: 'סוג: COMPETITIVE / POLL / MIXED' }) }).default('COMPETITIVE'),
  notes: z.string().trim().max(500, 'ההערות ארוכות מדי').optional(),
});
export type GenerateQuestionsInput = z.infer<typeof generateQuestionsSchema>;

/** המבנה שה-AI חייב להחזיר */
const questionsJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['questions'],
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['type', 'text', 'options', 'correctOption'],
        properties: {
          type: { type: 'string', enum: ['COMPETITIVE', 'POLL'] },
          text: { type: 'string' },
          options: { type: 'array', items: { type: 'string' } },
          correctOption: { type: ['integer', 'null'] },
        },
      },
    },
  },
};

const DIFFICULTY = { EASY: 'קלות', MEDIUM: 'בינוניות', HARD: 'קשות' } as const;
const KIND = {
  COMPETITIVE: 'כל השאלות תחרותיות (type=COMPETITIVE) עם תשובה נכונה אחת',
  POLL: 'כל השאלות הן שאלות סקר (type=POLL) בלי תשובה נכונה (correctOption=null)',
  MIXED: 'רוב השאלות תחרותיות (COMPETITIVE), ובערך אחת מכל ארבע היא שאלת סקר (POLL, correctOption=null)',
} as const;

const INSTRUCTIONS = `את כותבת שאלות לחידון כיתתי בעברית. המשתתפות עונות בטלפון בהקשה על 1 עד 4, והשאלה מוצגת על מסך.
כללים:
- כל הטקסט בעברית תקינה וברורה, מתאים לכיתה.
- שאלה: עד 250 תווים. כל תשובה: עד 80 תווים, קצרה.
- בדיוק 4 תשובות שונות זו מזו, בלי מספור ובלי אותיות (לא "א." ולא "1)").
- בשאלה תחרותית: correctOption הוא מספר התשובה הנכונה (1 עד 4), ותשובה אחת בלבד נכונה ללא ספק. פזרי את מיקום התשובה הנכונה.
- בשאלת סקר: correctOption = null.
- עובדות נכונות בלבד. אם אינך בטוחה בעובדה — אל תשאלי עליה.
- בלי שאלות כפולות.`;

export type QuestionDraft = z.infer<typeof fullQuestionSchema>;

/**
 * יצירת טיוטות שאלות. שום דבר לא נשמר: המנחה רואה, בוחרת ושומרת בעצמה.
 * שאלה שה-AI החזיר לא תקינה (למשל תשובות כפולות) פשוט לא מוצגת.
 */
export async function generateQuestions(input: GenerateQuestionsInput) {
  const request = [
    `נושא: ${input.topic}`,
    `מספר שאלות: ${input.count}`,
    `רמת קושי: ${DIFFICULTY[input.difficulty]}`,
    `סוג: ${KIND[input.kind]}`,
    input.notes ? `הערות מהמורה: ${input.notes}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const raw = await aiProvider.generateJson({ instructions: INSTRUCTIONS, input: request, name: 'quiz_questions', schema: questionsJsonSchema });
  const list = (raw as { questions?: unknown }).questions;
  const items = Array.isArray(list) ? list : [];

  const questions: QuestionDraft[] = [];
  for (const item of items.slice(0, input.count)) {
    const q = item as { type?: unknown; text?: unknown; options?: unknown; correctOption?: unknown };
    const options = Array.isArray(q.options) ? q.options : [];
    const result = fullQuestionSchema.safeParse({
      type: q.type,
      text: q.text,
      option1: options[0],
      option2: options[1],
      option3: options[2],
      option4: options[3],
      correctOption: q.type === 'POLL' ? null : q.correctOption,
    });
    if (result.success && options.length === 4) questions.push(result.data);
  }
  return { questions, skipped: Math.min(items.length, input.count) - questions.length };
}
