import express, { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { parse } from '../../middleware/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import { loadGame } from '../games/games.controller';
import { idParam } from '../games/games.schemas';
import { MAX_IMAGE_BYTES, deleteQuestionImage, getImage, setQuestionImage } from './media.service';

/** קורא את גוף הבקשה כבייטים (רק בנתיב ההעלאה). סוג הקובץ האמיתי נבדק לפי התוכן */
export const rawImageBody = express.raw({ type: () => true, limit: MAX_IMAGE_BYTES });

export async function upload(req: Request, res: Response) {
  const { game } = await loadGame(req, 'write');
  const qid = parse(idParam, req.params.qid);
  res.json(await setQuestionImage(game, qid, req.body));
}

export async function remove(req: Request, res: Response) {
  const { game } = await loadGame(req, 'write');
  await deleteQuestionImage(game, parse(idParam, req.params.qid));
  res.status(204).end();
}

/**
 * הצגת תמונה — ציבורי, בלי Token (תגית img לא שולחת Token).
 * המזהה אקראי ואי אפשר לנחש אותו, ותמונה לא משתנה אף פעם (החלפה = מזהה חדש),
 * ולכן הדפדפן יכול לשמור אותה בזיכרון לתמיד.
 */
export const mediaRouter = Router();

mediaRouter.get(
  '/:imageId',
  asyncHandler(async (req: Request, res: Response) => {
    const id = parse(z.string().uuid('מזהה תמונה לא תקין'), req.params.imageId);
    const media = await getImage(id);
    res.setHeader('Content-Type', media.mimeType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Content-Security-Policy', "default-src 'none'");
    res.send(Buffer.from(media.data));
  }),
);
