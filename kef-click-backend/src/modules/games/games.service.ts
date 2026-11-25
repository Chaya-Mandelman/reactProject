import type { Game, GameStatus, Prisma, Question } from '@prisma/client';
import type { AuthUser } from '../../types/express';
import { prisma } from '../../db/prisma';
import { HttpError } from '../../utils/HttpError';
import type {
  CreateGameInput,
  CreateParticipantInput,
  CreateQuestionInput,
  GameListQuery,
  UpdateGameInput,
  UpdateParticipantInput,
  UpdateQuestionInput,
} from './games.schemas';
import { fullQuestionSchema } from './games.schemas';
import type { z } from 'zod';
import { parse } from '../../middleware/validate';

/** סטטוסים שבהם המשחק "פעיל" — הטלפונים של המשתתפים תפוסים */
export const ACTIVE_STATUSES: GameStatus[] = ['LOBBY', 'RUNNING', 'PAUSED'];
/** סטטוסים שבהם מותר לערוך את המשחק */
const EDITABLE_STATUSES: GameStatus[] = ['SETUP', 'FINISHED'];

// =============================================================
//  הרשאות גישה למשחק
// =============================================================

/**
 * מחזיר משחק רק אם למשתמש מותר לגשת אליו.
 * מנחה — רק משחק שלו. מנהל — כל משחק, אבל רק לקריאה ולמחיקה.
 * משחק של מנחה אחר מחזיר 404 (כדי לא לחשוף שהוא קיים).
 */
export async function getAccessibleGame(user: AuthUser, gameId: number, mode: 'read' | 'write' | 'delete'): Promise<Game> {
  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game) throw HttpError.notFound('המשחק לא נמצא');

  if (user.role === 'ADMIN') {
    if (mode === 'write') throw HttpError.forbidden('מנהל המערכת יכול לצפות ולמחוק משחקים, אבל לא לערוך או להריץ אותם');
    return game;
  }
  if (game.hostId !== user.id) throw HttpError.notFound('המשחק לא נמצא');
  return game;
}

export function assertEditable(game: Game) {
  if (!EDITABLE_STATUSES.includes(game.status)) {
    throw HttpError.conflict('אי אפשר לערוך משחק בזמן לובי או משחק פעיל. יש לסיים אותו קודם (stop)');
  }
}

// =============================================================
//  משחקים
// =============================================================

export async function listGames(query: GameListQuery) {
  const where: Prisma.GameWhereInput = {};
  if (query.hostId) where.hostId = query.hostId;
  if (query.status) where.status = query.status;
  if (query.search) where.title = { contains: query.search, mode: 'insensitive' };

  const orderBy: Prisma.GameOrderByWithRelationInput[] =
    query.sort === 'oldest'
      ? [{ createdAt: 'asc' }, { id: 'asc' }]
      : query.sort === 'title'
        ? [{ title: 'asc' }, { id: 'asc' }]
        : [{ createdAt: 'desc' }, { id: 'desc' }];

  const games = await prisma.game.findMany({
    where,
    orderBy,
    include: {
      host: { select: { id: true, name: true } },
      _count: { select: { questions: true, participants: true } },
    },
  });

  return games.map((g) => ({
    id: g.id,
    title: g.title,
    description: g.description,
    status: g.status,
    host: g.host,
    questionsCount: g._count.questions,
    participantsCount: g._count.participants,
    createdAt: g.createdAt,
    updatedAt: g.updatedAt,
  }));
}

/** שליפת שאלה עם המזהה של התמונה בלבד (בלי הבייטים) */
export const withImageId = { media: { select: { id: true } } } as const;

export function serializeQuestion(q: Question & { media?: { id: string } | null }) {
  return {
    id: q.id,
    order: q.order,
    type: q.type,
    text: q.text,
    option1: q.option1,
    option2: q.option2,
    option3: q.option3,
    option4: q.option4,
    correctOption: q.correctOption,
    imageId: q.media?.id ?? null,
  };
}

export async function getGameDetails(gameId: number) {
  const game = await prisma.game.findUniqueOrThrow({
    where: { id: gameId },
    include: {
      host: { select: { id: true, name: true } },
      questions: { orderBy: [{ order: 'asc' }, { id: 'asc' }], include: withImageId },
      participants: { orderBy: [{ name: 'asc' }, { id: 'asc' }] },
    },
  });
  return {
    id: game.id,
    title: game.title,
    description: game.description,
    status: game.status,
    host: game.host,
    createdAt: game.createdAt,
    updatedAt: game.updatedAt,
    questions: game.questions.map(serializeQuestion),
    participants: game.participants.map((p) => ({ id: p.id, name: p.name, phone: p.phone })),
  };
}

export async function createGame(hostId: number, input: CreateGameInput) {
  const game = await prisma.game.create({
    data: { hostId, title: input.title, description: input.description ?? null },
  });
  return getGameDetails(game.id);
}

export async function updateGame(game: Game, input: UpdateGameInput) {
  assertEditable(game);
  await prisma.game.update({
    where: { id: game.id },
    data: { title: input.title, description: input.description },
  });
  return getGameDetails(game.id);
}

export async function deleteGame(user: AuthUser, game: Game) {
  if (user.role !== 'ADMIN' && ACTIVE_STATUSES.includes(game.status)) {
    throw HttpError.conflict('אי אפשר למחוק משחק פעיל. יש לסיים אותו קודם (stop)');
  }
  await prisma.game.delete({ where: { id: game.id } });
}

/** שכפול: שם חדש, אותן שאלות (כולל תמונות) ואותם משתתפים, סטטוס הכנה */
export async function duplicateGame(hostId: number, gameId: number) {
  const src = await prisma.game.findUniqueOrThrow({
    where: { id: gameId },
    include: {
      questions: { orderBy: [{ order: 'asc' }, { id: 'asc' }], include: { media: true } },
      participants: true,
    },
  });
  const suffix = ' (עותק)';
  const title = src.title.slice(0, 100 - suffix.length) + suffix;

  const copy = await prisma.game.create({
    data: {
      hostId,
      title,
      description: src.description,
      questions: {
        create: src.questions.map((q, i) => ({
          order: i + 1,
          type: q.type,
          text: q.text,
          option1: q.option1,
          option2: q.option2,
          option3: q.option3,
          option4: q.option4,
          correctOption: q.correctOption,
          ...(q.media ? { media: { create: { mimeType: q.media.mimeType, size: q.media.size, data: q.media.data } } } : {}),
        })),
      },
      participants: { create: src.participants.map((p) => ({ name: p.name, phone: p.phone })) },
    },
  });
  return getGameDetails(copy.id);
}

// =============================================================
//  משתתפים
// =============================================================

function serializeParticipant(p: { id: number; name: string; phone: string }) {
  return { id: p.id, name: p.name, phone: p.phone };
}

export async function addParticipant(game: Game, input: CreateParticipantInput) {
  assertEditable(game);
  const dup = await prisma.participant.findUnique({ where: { gameId_phone: { gameId: game.id, phone: input.phone } } });
  if (dup) throw HttpError.conflict(`הטלפון ${input.phone} כבר רשום במשחק הזה (${dup.name})`);
  const p = await prisma.participant.create({ data: { gameId: game.id, name: input.name, phone: input.phone } });
  return serializeParticipant(p);
}

/**
 * הוספת הרבה משתתפים בבת אחת: או שכולם נשמרים או אף אחד.
 * טלפון כפול (בתוך הרשימה או מול מי שכבר רשום) — שגיאה עם פירוט לכל שורה.
 */
export async function addParticipantsBulk(game: Game, inputs: CreateParticipantInput[]) {
  assertEditable(game);
  const existing = await prisma.participant.findMany({ where: { gameId: game.id }, select: { name: true, phone: true } });
  const taken = new Map(existing.map((p) => [p.phone, p.name]));
  const problems: { field: string; message: string }[] = [];
  inputs.forEach((p, i) => {
    const owner = taken.get(p.phone);
    if (owner !== undefined) problems.push({ field: `participants.${i}.phone`, message: `הטלפון ${p.phone} כבר רשום במשחק (${owner})` });
    else taken.set(p.phone, p.name);
  });
  if (problems.length > 0) throw HttpError.conflict('יש טלפונים כפולים ברשימה', problems);

  const created = await prisma.$transaction(
    inputs.map((p) => prisma.participant.create({ data: { gameId: game.id, name: p.name, phone: p.phone } })),
  );
  return created.map(serializeParticipant);
}

export async function updateParticipant(game: Game, participantId: number, input: UpdateParticipantInput) {
  assertEditable(game);
  const p = await prisma.participant.findFirst({ where: { id: participantId, gameId: game.id } });
  if (!p) throw HttpError.notFound('המשתתף לא נמצא במשחק הזה');
  if (input.phone && input.phone !== p.phone) {
    const dup = await prisma.participant.findUnique({ where: { gameId_phone: { gameId: game.id, phone: input.phone } } });
    if (dup) throw HttpError.conflict(`הטלפון ${input.phone} כבר רשום במשחק הזה (${dup.name})`);
  }
  const updated = await prisma.participant.update({
    where: { id: p.id },
    data: { name: input.name, phone: input.phone },
  });
  return serializeParticipant(updated);
}

export async function deleteParticipant(game: Game, participantId: number) {
  assertEditable(game);
  const result = await prisma.participant.deleteMany({ where: { id: participantId, gameId: game.id } });
  if (result.count === 0) throw HttpError.notFound('המשתתף לא נמצא במשחק הזה');
}

// =============================================================
//  שאלות
// =============================================================

export async function addQuestion(game: Game, input: CreateQuestionInput) {
  assertEditable(game);
  const data = parse(fullQuestionSchema, { ...input, correctOption: input.correctOption ?? null });
  const last = await prisma.question.aggregate({ where: { gameId: game.id }, _max: { order: true } });
  const q = await prisma.question.create({
    data: { ...data, gameId: game.id, order: (last._max.order ?? 0) + 1 },
  });
  return serializeQuestion(q);
}

/** הוספת הרבה שאלות בבת אחת, בסוף הרשימה: או שכולן נשמרות או אף אחת */
export async function addQuestionsBulk(game: Game, inputs: CreateQuestionInput[]) {
  assertEditable(game);
  const problems: { field: string; message: string }[] = [];
  const valid: z.infer<typeof fullQuestionSchema>[] = [];
  inputs.forEach((input, i) => {
    const result = fullQuestionSchema.safeParse({ ...input, correctOption: input.correctOption ?? null });
    if (result.success) valid.push(result.data);
    else for (const issue of result.error.issues) problems.push({ field: `questions.${i}.${issue.path.join('.')}`, message: issue.message });
  });
  if (problems.length > 0) throw HttpError.badRequest('חלק מהשאלות אינן תקינות', problems);

  return prisma.$transaction(async (tx) => {
    const last = await tx.question.aggregate({ where: { gameId: game.id }, _max: { order: true } });
    const start = (last._max.order ?? 0) + 1;
    const created = [];
    for (const [i, data] of valid.entries()) {
      created.push(await tx.question.create({ data: { ...data, gameId: game.id, order: start + i } }));
    }
    return created.map(serializeQuestion);
  });
}

export async function updateQuestion(game: Game, questionId: number, input: UpdateQuestionInput) {
  assertEditable(game);
  const q = await prisma.question.findFirst({ where: { id: questionId, gameId: game.id } });
  if (!q) throw HttpError.notFound('השאלה לא נמצאה במשחק הזה');

  const type = input.type ?? q.type;
  let correctOption: number | null;
  if (input.correctOption !== undefined) correctOption = input.correctOption;
  else correctOption = type === 'POLL' ? null : q.correctOption; // מעבר לסקר מנקה את התשובה הנכונה

  const data = parse(fullQuestionSchema, {
    type,
    text: input.text ?? q.text,
    option1: input.option1 ?? q.option1,
    option2: input.option2 ?? q.option2,
    option3: input.option3 ?? q.option3,
    option4: input.option4 ?? q.option4,
    correctOption,
  });
  const updated = await prisma.question.update({ where: { id: q.id }, data, include: withImageId });
  return serializeQuestion(updated);
}

export async function deleteQuestion(game: Game, questionId: number) {
  assertEditable(game);
  await prisma.$transaction(async (tx) => {
    const result = await tx.question.deleteMany({ where: { id: questionId, gameId: game.id } });
    if (result.count === 0) throw HttpError.notFound('השאלה לא נמצאה במשחק הזה');
    await renumber(tx, game.id);
  });
}

async function renumber(tx: Prisma.TransactionClient, gameId: number) {
  const rest = await tx.question.findMany({ where: { gameId }, orderBy: [{ order: 'asc' }, { id: 'asc' }] });
  for (const [i, item] of rest.entries()) {
    if (item.order !== i + 1) await tx.question.update({ where: { id: item.id }, data: { order: i + 1 } });
  }
}

/** שינוי סדר: הרשימה חייבת לכלול בדיוק את כל השאלות של המשחק, כל אחת פעם אחת */
export async function reorderQuestions(game: Game, questionIds: number[]) {
  assertEditable(game);
  const existing = await prisma.question.findMany({ where: { gameId: game.id }, select: { id: true } });
  const existingIds = new Set(existing.map((q) => q.id));
  const unique = new Set(questionIds);
  if (unique.size !== questionIds.length || unique.size !== existingIds.size || questionIds.some((id) => !existingIds.has(id))) {
    throw HttpError.badRequest('הרשימה חייבת לכלול בדיוק את כל השאלות של המשחק, כל אחת פעם אחת');
  }
  await prisma.$transaction(
    questionIds.map((id, i) => prisma.question.update({ where: { id }, data: { order: i + 1 } })),
  );
  const questions = await prisma.question.findMany({ where: { gameId: game.id }, orderBy: { order: 'asc' }, include: withImageId });
  return questions.map(serializeQuestion);
}
