import type { Request, Response } from 'express';
import { parse } from '../../middleware/validate';
import { idParam } from '../games/games.schemas';
import * as gamesService from '../games/games.service';
import { adminGameListQuerySchema, createHostSchema, hostListQuerySchema, updateHostSchema } from './admin.schemas';
import * as adminService from './admin.service';

export async function listHosts(req: Request, res: Response) {
  const query = parse(hostListQuerySchema, req.query);
  res.json({ hosts: await adminService.listHosts(query) });
}

export async function createHost(req: Request, res: Response) {
  const input = parse(createHostSchema, req.body);
  res.status(201).json({ host: await adminService.createHost(input) });
}

export async function updateHost(req: Request, res: Response) {
  const id = parse(idParam, req.params.id);
  const input = parse(updateHostSchema, req.body);
  res.json({ host: await adminService.updateHost(id, input) });
}

export async function listAllGames(req: Request, res: Response) {
  const query = parse(adminGameListQuerySchema, req.query);
  res.json({ games: await gamesService.listGames({ ...query, hostId: query.hostId }) });
}
