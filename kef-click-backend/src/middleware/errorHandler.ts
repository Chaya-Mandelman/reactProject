import { Prisma } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/HttpError';

/** פורמט אחיד לכל שגיאה: { error: { code, message, details? } } */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(HttpError.notFound(`הכתובת ${req.method} ${req.path} לא קיימת`));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message, ...(err.details !== undefined ? { details: err.details } : {}) },
    });
  }

  // JSON שבור בגוף הבקשה
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: { code: 'BAD_JSON', message: 'גוף הבקשה אינו JSON תקין' } });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: { code: 'CONFLICT', message: 'ערך כפול — כבר קיים רשומה עם אותם פרטים' } });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'לא נמצא' } });
    }
  }

  // eslint-disable-next-line no-console
  console.error(err);
  return res.status(500).json({ error: { code: 'INTERNAL', message: 'שגיאת שרת פנימית' } });
}
