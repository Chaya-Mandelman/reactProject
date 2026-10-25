import type { Prisma } from '@prisma/client';
import { prisma } from '../../db/prisma';
import { HttpError } from '../../utils/HttpError';
import { hashPassword, publicUser } from '../auth/auth.service';
import type { CreateHostInput, HostListQuery, UpdateHostInput } from './admin.schemas';

export async function listHosts(query: HostListQuery) {
  const where: Prisma.UserWhereInput = { role: 'HOST' };
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
    ];
  }
  if (query.blocked) where.isBlocked = query.blocked === 'true';

  const hosts = await prisma.user.findMany({
    where,
    orderBy: { name: 'asc' },
    include: { _count: { select: { games: true } } },
  });
  return hosts.map((h) => ({ ...publicUser(h), gamesCount: h._count.games }));
}

export async function createHost(input: CreateHostInput) {
  const exists = await prisma.user.findUnique({ where: { email: input.email } });
  if (exists) throw HttpError.conflict('כבר קיים משתמש עם האימייל הזה');
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, passwordHash: await hashPassword(input.password), role: 'HOST' },
  });
  return publicUser(user);
}

export async function updateHost(id: number, input: UpdateHostInput) {
  const host = await prisma.user.findUnique({ where: { id } });
  if (!host || host.role !== 'HOST') throw HttpError.notFound('המנחה לא נמצא');

  if (input.email && input.email !== host.email) {
    const exists = await prisma.user.findUnique({ where: { email: input.email } });
    if (exists) throw HttpError.conflict('כבר קיים משתמש עם האימייל הזה');
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      name: input.name,
      email: input.email,
      isBlocked: input.isBlocked,
      ...(input.password ? { passwordHash: await hashPassword(input.password) } : {}),
    },
  });
  return publicUser(user);
}
