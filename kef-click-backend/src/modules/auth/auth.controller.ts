import type { Request, Response } from 'express';
import { currentUser } from '../../middleware/auth';
import { parse } from '../../middleware/validate';
import { loginSchema, registerSchema } from './auth.schemas';
import * as authService from './auth.service';

export async function register(req: Request, res: Response) {
  const input = parse(registerSchema, req.body);
  res.status(201).json(await authService.register(input));
}

export async function login(req: Request, res: Response) {
  const input = parse(loginSchema, req.body);
  res.json(await authService.login(input));
}

export async function me(req: Request, res: Response) {
  res.json({ user: await authService.getMe(currentUser(req).id) });
}
