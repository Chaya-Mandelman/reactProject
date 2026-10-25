import crypto from 'node:crypto';
import express, { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { env } from '../../config/env';
import { asyncHandler } from '../../utils/asyncHandler';
import { handleYemotRequest } from './yemot.service';

/**
 * הכתובת שימות המשיח פונה אליה בכל שלב בשיחה.
 * הגנה: ימות המשיח שולח פרמטר key קבוע (api_add_0=key=...) שחייב להתאים ל-YEMOT_SECRET.
 * עובד גם ב-GET (ברירת המחדל של ימות המשיח) וגם ב-POST (api_url_post=yes).
 */
export const yemotRouter = Router();

/**
 * הגנה מניחוש המפתח: סופרים רק בקשות שנדחו (403).
 * בקשות תקינות לא נספרות — כל המשתתפות מגיעות מאותן כתובות של ימות המשיח.
 */
const badKeyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  handler: (_req, res) => {
    res.status(429).type('text/plain; charset=utf-8').send('too many requests');
  },
});

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

async function handle(req: Request, res: Response) {
  const receivedAt = new Date(); // הזמן נלקח מיד כשהבקשה הגיעה
  const params = { ...req.query, ...(typeof req.body === 'object' && req.body ? req.body : {}) } as Record<string, unknown>;
  const key = Array.isArray(params.key) ? String(params.key[0]) : String(params.key ?? '');

  if (!safeEqual(key, env.YEMOT_SECRET)) {
    res.status(403).type('text/plain; charset=utf-8').send('forbidden');
    return;
  }

  const text = await handleYemotRequest(params, receivedAt);
  res.status(200).type('text/plain; charset=utf-8').send(text);
}

yemotRouter.get('/call', badKeyLimiter, asyncHandler(handle));
yemotRouter.post('/call', badKeyLimiter, express.urlencoded({ extended: false }), asyncHandler(handle));
