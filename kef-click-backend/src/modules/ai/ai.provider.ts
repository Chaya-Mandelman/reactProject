import OpenAI from 'openai';
import { env } from '../../config/env';
import { HttpError } from '../../utils/HttpError';

/** מפתח תקין הוא מילה אחת: בלי רווחים ובלי ירידת שורה (למשל כשהודבקו כמה שורות מ-.env לשדה אחד) */
export const isUsableKey = (key: string | undefined): key is string => Boolean(key) && !/\s/.test(key!);

/** מסתיר מפתחות מכל טקסט שנכתב ליומן */
export function redactSecrets(text: string, key = env.OPENAI_API_KEY): string {
  let out = text.replace(/sk-[A-Za-z0-9_-]{8,}/g, 'sk-***');
  if (key) {
    for (const part of key.split(/\s+/).filter((p) => p.length >= 8)) out = out.split(part).join('***');
  }
  return out;
}

/** תיאור קצר ובטוח של שגיאה ליומן: סוג, קוד והודעה — בלי כותרות הבקשה ובלי המפתח */
export function describeError(error: unknown): string {
  if (error instanceof OpenAI.APIError) {
    return redactSecrets(`${error.name} status=${error.status ?? '-'} code=${error.code ?? '-'} ${error.message}`);
  }
  if (error instanceof Error) return redactSecrets(`${error.name}: ${error.message}`);
  return 'unknown error';
}

const apiKey = isUsableKey(env.OPENAI_API_KEY) ? env.OPENAI_API_KEY : undefined;
if (env.OPENAI_API_KEY && !apiKey) {
  // eslint-disable-next-line no-console
  console.error('❌ OPENAI_API_KEY מכיל רווח או ירידת שורה — ה-AI כבוי. יש להזין ב-Render רק את המפתח, בשורה אחת');
}

/** האם מוגדר מפתח תקין של OpenAI */
export const aiEnabled = () => Boolean(apiKey);

let client: OpenAI | null = null;
function getClient() {
  if (!apiKey) throw new HttpError(503, 'AI_DISABLED', 'יצירה עם AI לא מוגדרת בשרת (חסר OPENAI_API_KEY או שהוא לא תקין)');
  client ??= new OpenAI({ apiKey, timeout: 90_000, maxRetries: 1 });
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
  if (error instanceof OpenAI.NotFoundError) {
    return new HttpError(502, 'AI_ERROR', `המודל ${env.OPENAI_MODEL} לא זמין בחשבון OpenAI. יש לשנות את OPENAI_MODEL`);
  }
  // רק תיאור קצר ובטוח — אובייקט השגיאה המלא עלול לכלול את המפתח
  // eslint-disable-next-line no-console
  console.error('OpenAI error:', describeError(error));
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
