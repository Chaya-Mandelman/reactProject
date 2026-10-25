import type { Request, Response } from 'express';
import { currentUser } from '../../middleware/auth';
import { parse } from '../../middleware/validate';
import {
  createGameSchema,
  createParticipantSchema,
  createQuestionSchema,
  gameListQuerySchema,
  idParam,
  reorderQuestionsSchema,
  updateGameSchema,
  updateParticipantSchema,
  updateQuestionSchema,
} from './games.schemas';
import * as service from './games.service';

/** טוען את המשחק מהכתובת ובודק הרשאה */
async function loadGame(req: Request, mode: 'read' | 'write' | 'delete') {
  const user = currentUser(req);
  const gameId = parse(idParam, req.params.id);
  return { user, game: await service.getAccessibleGame(user, gameId, mode) };
}

// ===== משחקים =====
export async function list(req: Request, res: Response) {
  const query = parse(gameListQuerySchema, req.query);
  res.json({ games: await service.listGames({ ...query, hostId: currentUser(req).id }) });
}

export async function create(req: Request, res: Response) {
  const input = parse(createGameSchema, req.body);
  res.status(201).json({ game: await service.createGame(currentUser(req).id, input) });
}

export async function getOne(req: Request, res: Response) {
  const { game } = await loadGame(req, 'read');
  res.json({ game: await service.getGameDetails(game.id) });
}

export async function update(req: Request, res: Response) {
  const { game } = await loadGame(req, 'write');
  const input = parse(updateGameSchema, req.body);
  res.json({ game: await service.updateGame(game, input) });
}

export async function remove(req: Request, res: Response) {
  const { user, game } = await loadGame(req, 'delete');
  await service.deleteGame(user, game);
  res.status(204).end();
}

export async function duplicate(req: Request, res: Response) {
  const { user, game } = await loadGame(req, 'write');
  res.status(201).json({ game: await service.duplicateGame(user.id, game.id) });
}

// ===== משתתפים =====
export async function addParticipant(req: Request, res: Response) {
  const { game } = await loadGame(req, 'write');
  const input = parse(createParticipantSchema, req.body);
  res.status(201).json({ participant: await service.addParticipant(game, input) });
}

export async function updateParticipant(req: Request, res: Response) {
  const { game } = await loadGame(req, 'write');
  const pid = parse(idParam, req.params.pid);
  const input = parse(updateParticipantSchema, req.body);
  res.json({ participant: await service.updateParticipant(game, pid, input) });
}

export async function deleteParticipant(req: Request, res: Response) {
  const { game } = await loadGame(req, 'write');
  await service.deleteParticipant(game, parse(idParam, req.params.pid));
  res.status(204).end();
}

// ===== שאלות =====
export async function addQuestion(req: Request, res: Response) {
  const { game } = await loadGame(req, 'write');
  const input = parse(createQuestionSchema, req.body);
  res.status(201).json({ question: await service.addQuestion(game, input) });
}

export async function updateQuestion(req: Request, res: Response) {
  const { game } = await loadGame(req, 'write');
  const qid = parse(idParam, req.params.qid);
  const input = parse(updateQuestionSchema, req.body);
  res.json({ question: await service.updateQuestion(game, qid, input) });
}

export async function deleteQuestion(req: Request, res: Response) {
  const { game } = await loadGame(req, 'write');
  await service.deleteQuestion(game, parse(idParam, req.params.qid));
  res.status(204).end();
}

export async function reorderQuestions(req: Request, res: Response) {
  const { game } = await loadGame(req, 'write');
  const { questionIds } = parse(reorderQuestionsSchema, req.body);
  res.json({ questions: await service.reorderQuestions(game, questionIds) });
}

export { loadGame };
