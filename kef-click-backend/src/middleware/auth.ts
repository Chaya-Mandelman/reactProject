import type { Role } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { prisma } from '../db/prisma';
import { HttpError } from '../utils/HttpError';
import { asyncHandler } from '../utils/asyncHandler';

interface TokenPayload {
  sub: string;
  role: Role;
}

export function signToken(user: { id: number; role: Role }): string {
  return jwt.sign({ role: user.role }, env.JWT_SECRET, {
    subject: String(user.id),
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

/**
 * מחייב Bearer Token תקין.
 * בודק גם במסד הנתונים שהמשתמש עדיין קיים ולא חסום —
 * כך חסימה של מנחה נכנסת לתוקף מיד, גם אם יש לו Token ישן.
 */
export const authenticate = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization ?? '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw HttpError.unauthorized('חסר Token. יש לשלוח Authorization: Bearer <token>');
  }

  let payload: TokenPayload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET) as unknown as TokenPayload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) throw HttpError.unauthorized('פג תוקף ה-Token. יש להתחבר מחדש');
    throw HttpError.unauthorized('Token לא תקין');
  }

  const userId = Number(payload.sub);
  if (!Number.isInteger(userId)) throw HttpError.unauthorized('Token לא תקין');

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw HttpError.unauthorized('המשתמש לא קיים');
  if (user.isBlocked) throw HttpError.forbidden('החשבון חסום. פני למנהל המערכת');

  req.user = { id: user.id, role: user.role, name: user.name, email: user.email };
  next();
});

/** מאפשר גישה רק לתפקידים מסוימים (אחרת 403) */
export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(HttpError.unauthorized());
    if (!roles.includes(req.user.role)) return next(HttpError.forbidden());
    return next();
  };
}

/** מחזיר את המשתמש המחובר (נקרא רק אחרי authenticate) */
export function currentUser(req: Request) {
  if (!req.user) throw HttpError.unauthorized();
  return req.user;
}
