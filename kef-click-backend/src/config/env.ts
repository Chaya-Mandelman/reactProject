import 'dotenv/config';
import { z } from 'zod';

/**
 * קריאה ובדיקה של משתני הסביבה בעליית השרת.
 * אם משהו חסר או לא תקין — השרת לא עולה ומדפיס הסבר ברור.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL חסר'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET חייב להיות לפחות 32 תווים'),
  JWT_EXPIRES_IN: z.string().default('8h'),
  CORS_ORIGIN: z.string().default('*'),
  YEMOT_SECRET: z.string().min(8, 'YEMOT_SECRET חייב להיות לפחות 8 תווים'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const problems = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
  // eslint-disable-next-line no-console
  console.error(`\n❌ משתני סביבה לא תקינים:\n${problems}\nבדקי את קובץ .env (ראי .env.example)\n`);
  process.exit(1);
}

export const env = parsed.data;

/** רשימת הכתובות שמורשות לפנות לשרת (CORS) */
export const corsOrigins: string[] | '*' =
  env.CORS_ORIGIN.trim() === '*'
    ? '*'
    : env.CORS_ORIGIN.split(',')
        .map((s) => s.trim())
        .filter(Boolean);
