import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate, currentUser } from '../../middleware/auth';
import { parse } from '../../middleware/validate';
import { asyncHandler } from '../../utils/asyncHandler';
import { loadGame } from '../games/games.controller';
import { aiEnabled } from './ai.provider';
import { generateQuestions, generateQuestionsSchema } from './ai.service';

/** הגבלת פניות ל-AI לכל מנחה — כל פנייה עולה כסף בחשבון OpenAI */
export const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req) => `user-${currentUser(req).id}`,
  skip: () => process.env.NODE_ENV === 'test',
  message: { error: { code: 'TOO_MANY_REQUESTS', message: 'יותר מדי בקשות ל-AI. נסי שוב בעוד כמה דקות' } },
});

/** יצירת טיוטות שאלות למשחק. לא שומר כלום */
export async function generateGameQuestions(req: Request, res: Response) {
  await loadGame(req, 'write');
  const input = parse(generateQuestionsSchema, req.body);
  res.json(await generateQuestions(input));
}

/** האם ה-AI מוגדר בשרת — כדי שהקליינט יציג או יסתיר את הכפתורים */
export const aiRouter = Router();
aiRouter.get('/status', authenticate, (_req, res) => {
  res.json({ enabled: aiEnabled() });
});
