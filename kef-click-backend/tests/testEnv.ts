/**
 * הגדרות סביבת הבדיקות.
 * הבדיקות רצות מול PostgreSQL אמיתי, במסד נתונים נפרד שנמחק ונבנה מחדש בכל הרצה.
 * אפשר לשנות את הכתובת עם TEST_DATABASE_URL.
 */
export const TEST_ENV: Record<string, string> = {
  NODE_ENV: 'test',
  DATABASE_URL:
    process.env.TEST_DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/kefclick_test?schema=public',
  JWT_SECRET: 'test-secret-that-is-definitely-longer-than-32-chars',
  JWT_EXPIRES_IN: '1h',
  YEMOT_SECRET: 'test-yemot-secret',
  CORS_ORIGIN: '*',
};
