import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import * as play from '../gameplay/gameplay.controller';
import * as ai from '../ai/ai.routes';
import * as media from '../media/media.routes';
import * as ctrl from './games.controller';

/**
 * נתיבי משחקים.
 * רשימה ויצירה — מנחה בלבד. צפייה ומחיקה — גם מנהל (בדיקת בעלות בתוך ה-Service).
 */
export const gamesRouter = Router();

gamesRouter.use(authenticate);

const hostOnly = requireRole('HOST');

gamesRouter.get('/', hostOnly, asyncHandler(ctrl.list));
gamesRouter.post('/', hostOnly, asyncHandler(ctrl.create));
gamesRouter.get('/:id', asyncHandler(ctrl.getOne));
gamesRouter.patch('/:id', hostOnly, asyncHandler(ctrl.update));
gamesRouter.delete('/:id', asyncHandler(ctrl.remove));
gamesRouter.post('/:id/duplicate', hostOnly, asyncHandler(ctrl.duplicate));

// משתתפים
gamesRouter.post('/:id/ai/participants', hostOnly, ai.aiLimiter, asyncHandler(ai.extractGameParticipants));
gamesRouter.post('/:id/participants/bulk', hostOnly, asyncHandler(ctrl.addParticipantsBulk));
gamesRouter.post('/:id/participants', hostOnly, asyncHandler(ctrl.addParticipant));
gamesRouter.patch('/:id/participants/:pid', hostOnly, asyncHandler(ctrl.updateParticipant));
gamesRouter.delete('/:id/participants/:pid', hostOnly, asyncHandler(ctrl.deleteParticipant));

// שאלות (שים לב: order לפני :qid)
gamesRouter.put('/:id/questions/order', hostOnly, asyncHandler(ctrl.reorderQuestions));
gamesRouter.post('/:id/questions/bulk', hostOnly, asyncHandler(ctrl.addQuestionsBulk));
gamesRouter.post('/:id/ai/questions', hostOnly, ai.aiLimiter, asyncHandler(ai.generateGameQuestions));
gamesRouter.post('/:id/questions', hostOnly, asyncHandler(ctrl.addQuestion));
gamesRouter.patch('/:id/questions/:qid', hostOnly, asyncHandler(ctrl.updateQuestion));
gamesRouter.delete('/:id/questions/:qid', hostOnly, asyncHandler(ctrl.deleteQuestion));
gamesRouter.put('/:id/questions/:qid/image', hostOnly, media.rawImageBody, asyncHandler(media.upload));
gamesRouter.delete('/:id/questions/:qid/image', hostOnly, asyncHandler(media.remove));

// הרצת המשחק
gamesRouter.post('/:id/lobby', hostOnly, asyncHandler(play.lobby));
gamesRouter.post('/:id/start', hostOnly, asyncHandler(play.start));
gamesRouter.post('/:id/pause', hostOnly, asyncHandler(play.pause));
gamesRouter.post('/:id/resume', hostOnly, asyncHandler(play.resume));
gamesRouter.post('/:id/next', hostOnly, asyncHandler(play.next));
gamesRouter.post('/:id/skip', hostOnly, asyncHandler(play.skip));
gamesRouter.post('/:id/stop', hostOnly, asyncHandler(play.stop));
gamesRouter.get('/:id/live', hostOnly, asyncHandler(play.live));
