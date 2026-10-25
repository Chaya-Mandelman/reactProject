import { afterAll, beforeEach, vi } from 'vitest';
import { prisma } from '../src/db/prisma';

/** לפני כל בדיקה: מסד נתונים ריק ושעון אמיתי */
beforeEach(async () => {
  vi.useRealTimers();
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "Answer", "Question", "Participant", "Game", "User" RESTART IDENTITY CASCADE',
  );
});

afterAll(async () => {
  await prisma.$disconnect();
});
