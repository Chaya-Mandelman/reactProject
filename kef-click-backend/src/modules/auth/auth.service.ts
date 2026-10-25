import type { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../../db/prisma';
import { signToken } from '../../middleware/auth';
import { HttpError } from '../../utils/HttpError';
import type { LoginInput, RegisterInput } from './auth.schemas';

/** ה-Hash הזה משמש כדי שבדיקת סיסמה תיקח זמן זהה גם כשהאימייל לא קיים */
const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', 10);

/** הפיכת משתמש לאובייקט ציבורי — בלי passwordHash */
export function publicUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isBlocked: user.isBlocked,
    createdAt: user.createdAt,
  };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  const ok = await bcrypt.compare(input.password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) throw HttpError.unauthorized('אימייל או סיסמה שגויים');
  if (user.isBlocked) throw HttpError.forbidden('החשבון חסום. פני למנהל המערכת');
  return { token: signToken(user), user: publicUser(user) };
}

/** הרשמה עצמית של מנחה — מחזירה Token כדי שיהיה מחובר מיד */
export async function register(input: RegisterInput) {
  const exists = await prisma.user.findUnique({ where: { email: input.email } });
  if (exists) throw HttpError.conflict('כבר קיים משתמש עם האימייל הזה');
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash: await bcrypt.hash(input.password, 10),
      role: 'HOST', // תמיד מנחה — אי אפשר להירשם כמנהל
    },
  });
  return { token: signToken(user), user: publicUser(user) };
}

export async function getMe(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw HttpError.unauthorized('המשתמש לא קיים');
  return publicUser(user);
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}
