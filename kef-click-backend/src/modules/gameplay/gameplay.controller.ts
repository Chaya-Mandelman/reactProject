import type { Request, Response } from 'express';
import { z } from 'zod';
import { parse } from '../../middleware/validate';
import { loadGame } from '../games/games.controller';
import * as service from './gameplay.service';

const liveQuerySchema = z.object({
  afterAnswerId: z.coerce.number().int().nonnegative('afterAnswerId לא תקין').optional(),
});

/** אחרי כל פעולת שליטה מחזירים את המצב החי, כדי שהמסך יתעדכן מיד */
async function respondLive(res: Response, gameId: number) {
  res.json({ live: await service.getLiveState(gameId) });
}

export async function lobby(req: Request, res: Response) {
  const { game } = await loadGame(req, 'write');
  await service.openLobby(game.id);
  await respondLive(res, game.id);
}

export async function start(req: Request, res: Response) {
  const { game } = await loadGame(req, 'write');
  await service.startGame(game.id);
  await respondLive(res, game.id);
}

export async function pause(req: Request, res: Response) {
  const { game } = await loadGame(req, 'write');
  await service.pauseGame(game.id);
  await respondLive(res, game.id);
}

export async function resume(req: Request, res: Response) {
  const { game } = await loadGame(req, 'write');
  await service.resumeGame(game.id);
  await respondLive(res, game.id);
}

export async function stop(req: Request, res: Response) {
  const { game } = await loadGame(req, 'write');
  await service.stopGame(game.id);
  await respondLive(res, game.id);
}

export async function live(req: Request, res: Response) {
  const { game } = await loadGame(req, 'write');
  const { afterAnswerId } = parse(liveQuerySchema, req.query);
  res.json({ live: await service.getLiveState(game.id, afterAnswerId) });
}
