import OpenAI from 'openai';
import { env } from '../../config/env';
import { HttpError } from '../../utils/HttpError';

/** האם מוגדר מפתח של OpenAI */
export const aiEnabled = () => Boolean(env.OPENAI_API_KEY);

let client: OpenAI | null = null;
function getClient() {
  if (!env.OPENAI_API_KEY) throw new HttpError(503, 'AI_DISABLED', 'יצירה עם AI לא מוגדרת בשרת (חסר OPENAI_API_KEY)');
  client ??= new OpenAI({ apiKey: env.OPENAI_API_KEY, timeout: 90_000, maxRetries: 1 });
  return client;
}

/** תרגום שגיאות של OpenAI להודעה ברורה למנחה (בלי לחשוף פרטים פנימיים) */
function toHttpError(error: unknown): HttpError {
  if (error instanceof HttpError) return error;
  if (error instanceof OpenAI.AuthenticationError || error instanceof OpenAI.PermissionDeniedError) {
    return new HttpError(502, 'AI_ERROR', 'מפתח ה-OpenAI בשרת לא תקין או חסום');
  }
  if (error instanceof OpenAI.RateLimitError) {
    return new HttpError(429, 'AI_BUSY', 'ה-AI עמוס או שנגמרה המכסה בחשבון OpenAI. נסי שוב בעוד כמה דקות');
  }
  if (error instanceof OpenAI.APIConnectionTimeoutError) return new HttpError(504, 'AI_TIMEOUT', 'ה-AI לא ענה בזמן. נסי שוב');
  // eslint-disable-next-line no-console
  console.error('OpenAI error:', error);
  return new HttpError(502, 'AI_ERROR', 'ה-AI לא הצליח לענות כרגע. נסי שוב');
}

/**
 * פנייה אחת ל-OpenAI שמחזירה JSON לפי סכמה (Structured Outputs).
 * עטוף באובייקט כדי שבבדיקות אפשר להחליף אותו בתשובה קבועה.
 */
export const aiProvider = {
  async generateJson(opts: { instructions: string; input: string; name: string; schema: Record<string, unknown> }): Promise<unknown> {
    try {
      const response = await getClient().responses.create({
        model: env.OPENAI_MODEL,
        instructions: opts.instructions,
        input: opts.input,
        text: { format: { type: 'json_schema', name: opts.name, schema: opts.schema, strict: true } },
      });
      if (response.status !== 'completed' || !response.output_text) {
        throw new HttpError(502, 'AI_ERROR', 'ה-AI לא סיים את התשובה. נסי לבקש פחות פריטים');
      }
      return JSON.parse(response.output_text);
    } catch (error) {
      throw toHttpError(error);
    }
  },
};
