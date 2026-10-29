/**
 * =============================================================
 *  מנוע המשחק — הלב של כיף Click
 * =============================================================
 *
 * עקרון חשוב: אין טיימרים שרצים ברקע.
 * מצב המשחק נשמר במסד הנתונים כ"שלב + זמן התחלת השלב",
 * ובכל קריאה (תשובה מטלפון או רענון של המסך) המנוע מחשב
 * לפי השעון איפה המשחק אמור להיות עכשיו, ומעדכן.
 *
 * למה זה טוב?
 *  - גם אם השרת היה עמוס או "נרדם" לרגע — הזמנים נשארים מדויקים,
 *    כי כל שלב מחושב לפי מועד הסיום המתוכנן שלו ולא לפי מתי שמנו לב.
 *  - אין שני תהליכים שמשנים את המשחק במקביל: כל פעולה נועלת את שורת
 *    המשחק במסד הנתונים (SELECT ... FOR UPDATE) עד שהיא מסתיימת.
 */
import type { Game, Prisma } from '@prisma/client';
import { GAME_RULES } from '../../config/game';
import { prisma } from '../../db/prisma';

export type Tx = Prisma.TransactionClient;

/** הרצת פעולה בטרנזקציה עם נעילת שורת המשחק */
export async function withLockedGame<T>(gameId: number, fn: (tx: Tx, game: Game) => Promise<T>): Promise<T> {
  return prisma.$transaction(
    async (tx) => {
      await tx.$executeRaw`SELECT id FROM "Game" WHERE id = ${gameId} FOR UPDATE`;
      const game = await tx.game.findUniqueOrThrow({ where: { id: gameId } });
      return fn(tx, game);
    },
    { timeout: 15_000, maxWait: 10_000 },
  );
}

/** רשימת מזהי השאלות לפי הסדר */
export async function orderedQuestionIds(tx: Tx, gameId: number): Promise<number[]> {
  const qs = await tx.question.findMany({
    where: { gameId },
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
    select: { id: true },
  });
  return qs.map((q) => q.id);
}

/** האם כל המשתתפים שמחוברים כרגע כבר ענו לשאלה (וחייב להיות לפחות מחובר אחד) */
export async function allConnectedAnswered(tx: Tx, gameId: number, questionId: number): Promise<boolean> {
  const connected = await tx.participant.count({ where: { gameId, connectedAt: { not: null } } });
  if (connected === 0) return false;
  const notAnswered = await tx.participant.count({
    where: { gameId, connectedAt: { not: null }, answers: { none: { questionId } } },
  });
  return notAnswered === 0;
}

/**
 * מקדם את המשחק לפי השעון:
 *   שאלה → (60 שניות או שכולם ענו) → חשיפה.
 * מהחשיפה ממשיכים רק כשהמנחה לוחצת "לשאלה הבאה" (nextQuestion).
 * מחזיר את המשחק המעודכן. עובד רק כשהסטטוס RUNNING.
 */
export async function advance(tx: Tx, game: Game, now: Date): Promise<Game> {
  if (game.status !== 'RUNNING' || game.phase === null || game.phaseStartedAt === null || game.currentQuestionIndex === null) {
    return game;
  }

  const questionIds = await orderedQuestionIds(tx, game.id);
  let phase: 'QUESTION' | 'REVEAL' = game.phase;
  let index: number = game.currentQuestionIndex;
  let phaseStartedAt: Date = game.phaseStartedAt;
  let status: Game['status'] = game.status;
  let finishedAt: Date | null = game.finishedAt;
  let changed = false;

  // לולאה — כדי "להשלים" כמה שלבים אם עבר הרבה זמן מאז הבדיקה האחרונה
  for (let guard = 0; guard < questionIds.length * 2 + 2; guard += 1) {
    if (status !== 'RUNNING') break;

    if (index >= questionIds.length) {
      // לא אמור לקרות (למשל נמחקו שאלות) — מסיימים בבטחה
      status = 'FINISHED';
      finishedAt = now;
      changed = true;
      break;
    }

    if (phase === 'QUESTION') {
      const deadline = new Date(phaseStartedAt.getTime() + GAME_RULES.QUESTION_TIME_MS);
      let closeAt: Date | null = null;
      if (now >= deadline) closeAt = deadline;
      else if (await allConnectedAnswered(tx, game.id, questionIds[index]!)) closeAt = now;
      if (!closeAt) break;
      phase = 'REVEAL';
      phaseStartedAt = closeAt;
      changed = true;
      continue;
    }

    // phase === 'REVEAL': החשיפה נשארת על המסך עד שהמנחה עוברת לשאלה הבאה
    break;
  }

  if (!changed) return game;

  return tx.game.update({
    where: { id: game.id },
    data:
      status === 'FINISHED'
        ? { status, finishedAt, phase: null, phaseStartedAt: null, currentQuestionIndex: null, pausedElapsedMs: null }
        : { status, phase, phaseStartedAt, currentQuestionIndex: index },
  });
}

/** כמה זמן עבר בשלב הנוכחי (במילישניות), כולל מצב השהיה */
export function elapsedInPhase(game: Game, now: Date): number {
  if (game.status === 'PAUSED') return game.pausedElapsedMs ?? 0;
  if (!game.phaseStartedAt) return 0;
  return Math.max(0, now.getTime() - game.phaseStartedAt.getTime());
}
