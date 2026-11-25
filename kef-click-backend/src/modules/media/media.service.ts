import type { Game } from '@prisma/client';
import { prisma } from '../../db/prisma';
import { HttpError } from '../../utils/HttpError';
import { assertEditable } from '../games/games.service';

/** גודל מקסימלי לתמונה (הקליינט מקטין לפני ההעלאה, זה רק גבול עליון) */
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

/**
 * זיהוי סוג התמונה לפי הבייטים הראשונים של הקובץ — לא לפי השם או הכותרת שנשלחו,
 * כדי שאי אפשר יהיה להעלות קובץ אחר בתחפושת של תמונה.
 */
export function detectImageType(data: Buffer): string | null {
  if (data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return 'image/jpeg';
  if (data.length >= 8 && data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (data.length >= 6 && ['GIF87a', 'GIF89a'].includes(data.subarray(0, 6).toString('latin1'))) return 'image/gif';
  if (data.length >= 12 && data.subarray(0, 4).toString('latin1') === 'RIFF' && data.subarray(8, 12).toString('latin1') === 'WEBP') {
    return 'image/webp';
  }
  return null;
}

async function findQuestion(game: Game, questionId: number) {
  const q = await prisma.question.findFirst({ where: { id: questionId, gameId: game.id }, select: { id: true } });
  if (!q) throw HttpError.notFound('השאלה לא נמצאה במשחק הזה');
  return q;
}

/** העלאה או החלפה של תמונה. בהחלפה נוצר מזהה חדש, כך שהדפדפן לא יציג את התמונה הישנה מהזיכרון */
export async function setQuestionImage(game: Game, questionId: number, body: unknown) {
  assertEditable(game);
  await findQuestion(game, questionId);
  if (!Buffer.isBuffer(body) || body.length === 0) {
    throw HttpError.badRequest('יש לשלוח קובץ תמונה (JPG, PNG, WEBP או GIF)');
  }
  const mimeType = detectImageType(body);
  if (!mimeType) throw HttpError.badRequest('הקובץ אינו תמונה נתמכת (JPG, PNG, WEBP או GIF)');

  const media = await prisma.$transaction(async (tx) => {
    await tx.questionMedia.deleteMany({ where: { questionId } });
    return tx.questionMedia.create({
      data: { questionId, mimeType, size: body.length, data: new Uint8Array(body) },
      select: { id: true },
    });
  });
  return { imageId: media.id };
}

export async function deleteQuestionImage(game: Game, questionId: number) {
  assertEditable(game);
  await findQuestion(game, questionId);
  await prisma.questionMedia.deleteMany({ where: { questionId } });
}

export async function getImage(id: string) {
  const media = await prisma.questionMedia.findUnique({ where: { id }, select: { mimeType: true, data: true } });
  if (!media) throw HttpError.notFound('התמונה לא נמצאה');
  return media;
}
