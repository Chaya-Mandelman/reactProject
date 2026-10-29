import type { Game, Question } from '@prisma/client';
import { GAME_RULES, pointsForCorrect } from '../../config/game';
import { prisma } from '../../db/prisma';
import { HttpError } from '../../utils/HttpError';
import { ACTIVE_STATUSES } from '../games/games.service';
import { advance, allConnectedAnswered, elapsedInPhase, orderedQuestionIds, withLockedGame, type Tx } from './engine';

/** מספר קבוע לנעילה גלובלית בזמן פתיחת לובי — מונע ששני משחקים יתפסו אותו טלפון בו-זמנית */
const LOBBY_ADVISORY_LOCK = 72_042_026;

// =============================================================
//  פעולות המנחה: לובי, התחלה, השהיה, המשך, שאלה הבאה, סיום
// =============================================================

/** פתיחת לובי: מאפס תשובות וניקוד מהסבב הקודם, ומשחרר את הטלפונים לחיבור */
export async function openLobby(gameId: number) {
  return withLockedGame(gameId, async (tx, game) => {
    if (game.status !== 'SETUP' && game.status !== 'FINISHED') {
      throw HttpError.conflict('אפשר לפתוח לובי רק למשחק בהכנה או משחק שהסתיים');
    }
    const [questions, participants] = await Promise.all([
      tx.question.count({ where: { gameId } }),
      tx.participant.findMany({ where: { gameId }, select: { name: true, phone: true } }),
    ]);
    if (questions === 0) throw HttpError.conflict('יש להוסיף לפחות שאלה אחת לפני פתיחת לובי');
    if (participants.length === 0) throw HttpError.conflict('יש להוסיף לפחות משתתף אחד לפני פתיחת לובי');

    // טלפון יכול להיות במשחק פעיל אחד בלבד
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${LOBBY_ADVISORY_LOCK}::bigint)`;
    const conflicts = await tx.participant.findMany({
      where: {
        phone: { in: participants.map((p) => p.phone) },
        gameId: { not: gameId },
        game: { status: { in: ACTIVE_STATUSES } },
      },
      select: { name: true, phone: true, game: { select: { id: true, title: true } } },
    });
    if (conflicts.length > 0) {
      throw HttpError.conflict(
        'חלק מהטלפונים כבר רשומים במשחק פעיל אחר. יש לסיים את המשחק השני או להסיר אותם',
        conflicts.map((c) => ({ phone: c.phone, name: c.name, gameId: c.game.id, gameTitle: c.game.title })),
      );
    }

    await tx.answer.deleteMany({ where: { question: { gameId } } });
    await tx.participant.updateMany({ where: { gameId }, data: { score: 0, connectedAt: null } });
    await tx.game.update({
      where: { id: gameId },
      data: {
        status: 'LOBBY',
        phase: null,
        phaseStartedAt: null,
        currentQuestionIndex: null,
        pausedElapsedMs: null,
        startedAt: null,
        finishedAt: null,
      },
    });
  });
}

export async function startGame(gameId: number) {
  const now = new Date();
  return withLockedGame(gameId, async (tx, game) => {
    if (game.status !== 'LOBBY') throw HttpError.conflict('אפשר להתחיל משחק רק מהלובי');
    const count = await tx.question.count({ where: { gameId } });
    if (count === 0) throw HttpError.conflict('אין שאלות במשחק');
    await tx.game.update({
      where: { id: gameId },
      data: { status: 'RUNNING', phase: 'QUESTION', phaseStartedAt: now, currentQuestionIndex: 0, startedAt: now },
    });
  });
}

export async function pauseGame(gameId: number) {
  const now = new Date();
  return withLockedGame(gameId, async (tx, locked) => {
    if (locked.status !== 'RUNNING') throw HttpError.conflict('אפשר להשהות רק משחק שרץ');
    const game = await advance(tx, locked, now);
    if (game.status !== 'RUNNING') throw HttpError.conflict('המשחק כבר הסתיים');
    await tx.game.update({
      where: { id: gameId },
      data: { status: 'PAUSED', pausedElapsedMs: elapsedInPhase(game, now) },
    });
  });
}

export async function resumeGame(gameId: number) {
  const now = new Date();
  return withLockedGame(gameId, async (tx, game) => {
    if (game.status !== 'PAUSED') throw HttpError.conflict('המשחק לא מושהה');
    // מזיזים את זמן תחילת השלב קדימה — כך זמן ההשהיה לא נספר
    const phaseStartedAt = new Date(now.getTime() - (game.pausedElapsedMs ?? 0));
    await tx.game.update({
      where: { id: gameId },
      data: { status: 'RUNNING', phaseStartedAt, pausedElapsedMs: null },
    });
  });
}

/** מעבר מהחשיפה לשאלה הבאה, או לסיום אחרי השאלה האחרונה */
export async function nextQuestion(gameId: number) {
  const now = new Date();
  return withLockedGame(gameId, async (tx, locked) => {
    if (locked.status !== 'RUNNING') throw HttpError.conflict('אפשר לעבור שאלה רק במשחק שרץ');
    const game = await advance(tx, locked, now);
    if (game.phase !== 'REVEAL' || game.currentQuestionIndex === null) {
      throw HttpError.conflict('אפשר לעבור לשאלה הבאה רק אחרי חשיפת התשובה');
    }
    const next = game.currentQuestionIndex + 1;
    const total = (await orderedQuestionIds(tx, gameId)).length;
    await tx.game.update({
      where: { id: gameId },
      data:
        next < total
          ? { phase: 'QUESTION', phaseStartedAt: now, currentQuestionIndex: next }
          : { status: 'FINISHED', finishedAt: now, phase: null, phaseStartedAt: null, currentQuestionIndex: null, pausedElapsedMs: null },
    });
  });
}

/** עצירה: מהלובי — חזרה להכנה. ממשחק רץ/מושהה — סיום מיידי עם סיכום */
export async function stopGame(gameId: number) {
  const now = new Date();
  return withLockedGame(gameId, async (tx, game) => {
    if (game.status === 'LOBBY') {
      await tx.participant.updateMany({ where: { gameId }, data: { connectedAt: null } });
      await tx.game.update({ where: { id: gameId }, data: { status: 'SETUP' } });
      return;
    }
    if (game.status !== 'RUNNING' && game.status !== 'PAUSED') {
      throw HttpError.conflict('המשחק לא פעיל');
    }
    await tx.game.update({
      where: { id: gameId },
      data: {
        status: 'FINISHED',
        finishedAt: now,
        phase: null,
        phaseStartedAt: null,
        currentQuestionIndex: null,
        pausedElapsedMs: null,
      },
    });
  });
}

// =============================================================
//  טבלת ניקוד
// =============================================================

/**
 * דירוג: יותר נקודות קודם. בשוויון — סכום זמני התשובות הנכונות (במילישניות) הקטן קודם.
 * בשוויון מלא — לפי שם.
 */
async function leaderboard(tx: Tx, gameId: number) {
  const participants = await tx.participant.findMany({
    where: { gameId },
    select: { id: true, name: true, score: true, answers: { where: { isCorrect: true }, select: { responseMs: true } } },
  });
  return participants
    .map((p) => ({
      participantId: p.id,
      name: p.name,
      score: p.score,
      correctCount: p.answers.length,
      totalCorrectMs: p.answers.reduce((s, a) => s + a.responseMs, 0),
    }))
    .sort((a, b) => b.score - a.score || a.totalCorrectMs - b.totalCorrectMs || a.name.localeCompare(b.name, 'he'))
    .map((row, i) => ({ rank: i + 1, ...row }));
}

function publicQuestion(q: Question, withAnswer: boolean) {
  return {
    id: q.id,
    type: q.type,
    text: q.text,
    options: [q.option1, q.option2, q.option3, q.option4],
    ...(withAnswer ? { correctOption: q.correctOption } : {}),
  };
}

// =============================================================
//  מצב חי למסך המנחה (נקרא כל שנייה)
// =============================================================

export async function getLiveState(gameId: number, afterAnswerId?: number) {
  const now = new Date();
  return withLockedGame(gameId, async (tx, locked) => {
    const game = await advance(tx, locked, now);
    const questionIds = await orderedQuestionIds(tx, gameId);

    const participants = await tx.participant.findMany({
      where: { gameId },
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
      select: { id: true, name: true, connectedAt: true },
    });

    const base = {
      serverTime: now.toISOString(),
      game: { id: game.id, title: game.title, status: game.status },
      totalQuestions: questionIds.length,
      participants: participants.map((p) => ({ id: p.id, name: p.name, connected: p.connectedAt !== null })),
      connectedCount: participants.filter((p) => p.connectedAt !== null).length,
    };

    if (game.status === 'FINISHED') {
      const board = await leaderboard(tx, gameId);
      return {
        ...base,
        phase: 'FINISHED' as const,
        summary: { winners: board.slice(0, GAME_RULES.WINNERS_COUNT), leaderboard: board },
      };
    }

    if ((game.status !== 'RUNNING' && game.status !== 'PAUSED') || game.currentQuestionIndex === null || !game.phase) {
      return { ...base, phase: game.status as 'SETUP' | 'LOBBY' };
    }

    const questionId = questionIds[game.currentQuestionIndex];
    const question = questionId ? await tx.question.findUnique({ where: { id: questionId } }) : null;
    if (!question) return { ...base, phase: game.status as 'RUNNING' | 'PAUSED' };

    const elapsed = elapsedInPhase(game, now);
    const isReveal = game.phase === 'REVEAL';
    const answers = await tx.answer.findMany({
      where: { questionId: question.id },
      orderBy: { id: 'asc' },
      include: { participant: { select: { name: true } } },
    });

    // שמות שקופצים במסך — רק תשובות חדשות (לפי מזהה) כדי לא להקפיץ שם פעמיים
    const recentAnswers = answers
      .filter((a) => afterAnswerId === undefined || a.id > afterAnswerId)
      .slice(-50)
      .map((a) => ({ answerId: a.id, participantId: a.participantId, name: a.participant.name, receivedAt: a.createdAt }));

    // 5 המהירים: בתחרותית — רק תשובות נכונות; בסקר — כל התשובות
    const fastest = answers
      .filter((a) => question.type === 'POLL' || a.isCorrect === true)
      .sort((a, b) => a.responseMs - b.responseMs || a.id - b.id)
      .slice(0, GAME_RULES.FASTEST_COUNT)
      .map((a) => ({ participantId: a.participantId, name: a.participant.name, responseMs: a.responseMs }));

    const result = {
      ...base,
      phase: game.phase,
      paused: game.status === 'PAUSED',
      questionNumber: game.currentQuestionIndex + 1,
      question: publicQuestion(question, isReveal),
      timeLeftMs: isReveal ? 0 : Math.max(0, GAME_RULES.QUESTION_TIME_MS - elapsed),
      isLastQuestion: game.currentQuestionIndex === questionIds.length - 1,
      answeredCount: answers.length,
      lastAnswerId: answers.length > 0 ? answers[answers.length - 1]!.id : null,
      recentAnswers,
      fastest,
    };

    if (!isReveal) return result;

    const distribution = [1, 2, 3, 4].map((opt) => answers.filter((a) => a.choice === opt).length);
    return {
      ...result,
      reveal: {
        correctOption: question.correctOption,
        distribution,
        leaderboard: await leaderboard(tx, gameId),
      },
    };
  });
}

// =============================================================
//  טלפון: חיבור, ניתוק ותשובה
// =============================================================

/** מוצא את המשתתף לפי טלפון במשחק הפעיל היחיד שבו הוא רשום */
export async function findActiveParticipant(phone: string) {
  return prisma.participant.findFirst({
    where: { phone, game: { status: { in: ACTIVE_STATUSES } } },
    include: { game: { select: { id: true, title: true } } },
  });
}

export type PhoneEvent =
  | { kind: 'NOT_REGISTERED' }
  | { kind: 'LOBBY'; name: string; gameTitle: string }
  | { kind: 'PAUSED'; name: string }
  | { kind: 'QUESTION_OPEN'; name: string; questionNumber: number; alreadyAnswered: boolean }
  | { kind: 'REVEAL'; name: string }
  | { kind: 'FINISHED'; name: string; score: number; rank: number }
  | { kind: 'ANSWERED'; name: string; questionType: 'COMPETITIVE' | 'POLL'; isCorrect: boolean | null; points: number }
  | { kind: 'ALREADY_ANSWERED'; name: string }
  | { kind: 'TOO_LATE'; name: string }
  | { kind: 'INVALID_KEY'; name: string };

/** מצב המשחק מנקודת המבט של המשתתף בטלפון (בלי תשובה) */
async function describeForPhone(tx: Tx, game: Game, participant: { id: number; name: string }): Promise<PhoneEvent> {
  const name = participant.name;
  if (game.status === 'LOBBY') return { kind: 'LOBBY', name, gameTitle: game.title };
  if (game.status === 'PAUSED') return { kind: 'PAUSED', name };
  if (game.status === 'FINISHED') {
    const board = await leaderboard(tx, game.id);
    const me = board.find((r) => r.participantId === participant.id);
    return { kind: 'FINISHED', name, score: me?.score ?? 0, rank: me?.rank ?? board.length };
  }
  if (game.status === 'RUNNING' && game.phase === 'QUESTION' && game.currentQuestionIndex !== null) {
    const ids = await orderedQuestionIds(tx, game.id);
    const qid = ids[game.currentQuestionIndex];
    const already = qid ? (await tx.answer.count({ where: { participantId: participant.id, questionId: qid } })) > 0 : false;
    return { kind: 'QUESTION_OPEN', name, questionNumber: game.currentQuestionIndex + 1, alreadyAnswered: already };
  }
  return { kind: 'REVEAL', name };
}

/**
 * כל פנייה מהטלפון עוברת כאן.
 * @param receivedAt הרגע שבו השרת קיבל את הבקשה — לפיו נמדד זמן התשובה
 * @param digit המקש שהוקש, או null אם אין תשובה בפנייה הזו
 */
export async function handlePhone(phone: string, digit: string | null, receivedAt: Date): Promise<PhoneEvent> {
  const found = await findActiveParticipant(phone);
  if (!found) {
    // משחק שהסתיים ב-10 הדקות האחרונות — אומרים למשתתף את התוצאה שלו במקום "לא רשום"
    const recent = await prisma.participant.findFirst({
      where: { phone, game: { status: 'FINISHED', finishedAt: { gte: new Date(receivedAt.getTime() - 10 * 60_000) } } },
      orderBy: { game: { finishedAt: 'desc' } },
      include: { game: true },
    });
    if (!recent) return { kind: 'NOT_REGISTERED' };
    return describeForPhone(prisma, recent.game, recent);
  }

  return withLockedGame(found.gameId, async (tx, locked) => {
    // בדיקה חוזרת אחרי הנעילה — אולי המשחק נסגר בינתיים
    const participant = await tx.participant.findUnique({ where: { id: found.id } });
    if (!participant || !ACTIVE_STATUSES.includes(locked.status)) return { kind: 'NOT_REGISTERED' } as const;

    if (!participant.connectedAt) {
      await tx.participant.update({ where: { id: participant.id }, data: { connectedAt: receivedAt } });
    }

    let game = await advance(tx, locked, receivedAt);

    if (digit === null) return describeForPhone(tx, game, participant);

    if (!/^[1-4]$/.test(digit)) return { kind: 'INVALID_KEY', name: participant.name };

    if (game.status !== 'RUNNING' || game.phase !== 'QUESTION' || game.currentQuestionIndex === null || !game.phaseStartedAt) {
      if (game.status === 'RUNNING' && game.phase === 'REVEAL') return { kind: 'TOO_LATE', name: participant.name };
      return describeForPhone(tx, game, participant);
    }

    const ids = await orderedQuestionIds(tx, game.id);
    const questionId = ids[game.currentQuestionIndex];
    const question = questionId ? await tx.question.findUnique({ where: { id: questionId } }) : null;
    if (!question) return describeForPhone(tx, game, participant);

    const existing = await tx.answer.findUnique({
      where: { participantId_questionId: { participantId: participant.id, questionId: question.id } },
    });
    if (existing) return { kind: 'ALREADY_ANSWERED', name: participant.name };

    const responseMs = Math.max(0, receivedAt.getTime() - game.phaseStartedAt.getTime());
    if (responseMs >= GAME_RULES.QUESTION_TIME_MS) return { kind: 'TOO_LATE', name: participant.name };

    const choice = Number(digit);
    const isCorrect = question.type === 'COMPETITIVE' ? choice === question.correctOption : null;
    const points = isCorrect ? pointsForCorrect(responseMs) : 0;

    await tx.answer.create({
      data: { participantId: participant.id, questionId: question.id, choice, responseMs, isCorrect, points, createdAt: receivedAt },
    });
    if (points > 0) {
      await tx.participant.update({ where: { id: participant.id }, data: { score: { increment: points } } });
    }

    // אם כולם ענו — סוגרים את השאלה מיד
    if (await allConnectedAnswered(tx, game.id, question.id)) {
      game = await advance(tx, game, receivedAt);
    }

    return { kind: 'ANSWERED', name: participant.name, questionType: question.type, isCorrect, points };
  });
}

/** ניתוק שיחה — המשתתף כבר לא מסומן "מחובר" */
export async function handleHangup(phone: string) {
  const found = await findActiveParticipant(phone);
  if (!found) return;
  await withLockedGame(found.gameId, async (tx) => {
    await tx.participant.update({ where: { id: found.id }, data: { connectedAt: null } });
  });
}
