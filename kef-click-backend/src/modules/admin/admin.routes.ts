import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import * as ctrl from './admin.controller';

/** כל הנתיבים כאן — למנהל מערכת בלבד */
export const adminRouter = Router();

adminRouter.use(authenticate, requireRole('ADMIN'));

adminRouter.get('/hosts', asyncHandler(ctrl.listHosts));
adminRouter.post('/hosts', asyncHandler(ctrl.createHost));
adminRouter.patch('/hosts/:id', asyncHandler(ctrl.updateHost));
adminRouter.get('/games', asyncHandler(ctrl.listAllGames));
