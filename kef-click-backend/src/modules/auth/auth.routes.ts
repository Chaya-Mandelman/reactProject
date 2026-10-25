import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import * as ctrl from './auth.controller';

/** הגבלת ניסיונות התחברות — הגנה מניחוש סיסמאות */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  message: { error: { code: 'TOO_MANY_REQUESTS', message: 'יותר מדי ניסיונות התחברות. נסי שוב בעוד כמה דקות' } },
});

/** הגבלת הרשמות — מונע פתיחת חשבונות המוניים */
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  message: { error: { code: 'TOO_MANY_REQUESTS', message: 'יותר מדי הרשמות מהכתובת הזו. נסי שוב מאוחר יותר' } },
});

export const authRouter = Router();

authRouter.post('/register', registerLimiter, asyncHandler(ctrl.register));
authRouter.post('/login', loginLimiter, asyncHandler(ctrl.login));
authRouter.get('/me', authenticate, asyncHandler(ctrl.me));
