import bcrypt from 'bcryptjs';
import request from 'supertest';
import { vi } from 'vitest';
import { createApp } from '../src/app';
import { prisma } from '../src/db/prisma';

export const app = createApp();
export const api = () => request(app);
export const YEMOT_KEY = 'test-yemot-secret';
export const PASSWORD = 'Passw0rd!';

let counter = 0;

export async function createUser(role: 'ADMIN' | 'HOST', opts: { name?: string; isBlocked?: boolean } = {}) {
  counter += 1;
  const email = `${role.toLowerCase()}${counter}@test.local`;
  const user = await prisma.user.create({
    data: {
      name: opts.name ?? `${role === 'ADMIN' ? 'מנהלת' : 'מנחה'} ${counter}`,
      email,
      role,
      isBlocked: opts.isBlocked ?? false,
      passwordHash: await bcrypt.hash(PASSWORD, 4),
    },
  });
  return user;
}

export async function tokenFor(email: string, password = PASSWORD) {
  const res = await api().post('/api/auth/login').send({ email, password });
  if (res.status !== 200) throw new Error(`login failed: ${res.status} ${JSON.stringify(res.body)}`);
  return res.body.token as string;
}

/** מנחה + Token מוכן */
export async function hostWithToken(name?: string) {
  const user = await createUser('HOST', { name });
  const token = await tokenFor(user.email);
  return { user, token, auth: { Authorization: `Bearer ${token}` } };
}

export async function adminWithToken() {
  const user = await createUser('ADMIN');
  const token = await tokenFor(user.email);
  return { user, token, auth: { Authorization: `Bearer ${token}` } };
}

export const competitive = (text: string, correct: number) => ({
  type: 'COMPETITIVE',
  text,
  option1: 'תשובה א',
  option2: 'תשובה ב',
  option3: 'תשובה ג',
  option4: 'תשובה ד',
  correctOption: correct,
});

export const poll = (text: string) => ({
  type: 'POLL',
  text,
  option1: 'אפשרות א',
  option2: 'אפשרות ב',
  option3: 'אפשרות ג',
  option4: 'אפשרות ד',
});

/** יוצר משחק מלא דרך ה-API ומחזיר את המזהים */
export async function createFullGame(
  auth: Record<string, string>,
  opts: { questions?: Record<string, unknown>[]; participants?: { name: string; phone: string }[]; title?: string } = {},
) {
  const g = await api().post('/api/games').set(auth).send({ title: opts.title ?? 'משחק בדיקה' });
  if (g.status !== 201) throw new Error(`create game failed: ${JSON.stringify(g.body)}`);
  const gameId = g.body.game.id as number;

  const questions = opts.questions ?? [competitive('שאלה 1', 2), competitive('שאלה 2', 3)];
  const questionIds: number[] = [];
  for (const q of questions) {
    const r = await api().post(`/api/games/${gameId}/questions`).set(auth).send(q);
    if (r.status !== 201) throw new Error(`add question failed: ${JSON.stringify(r.body)}`);
    questionIds.push(r.body.question.id);
  }

  const participants = opts.participants ?? [
    { name: 'שירה', phone: '0500000101' },
    { name: 'נועה', phone: '0500000102' },
  ];
  const participantIds: number[] = [];
  for (const p of participants) {
    const r = await api().post(`/api/games/${gameId}/participants`).set(auth).send(p);
    if (r.status !== 201) throw new Error(`add participant failed: ${JSON.stringify(r.body)}`);
    participantIds.push(r.body.participant.id);
  }
  return { gameId, questionIds, participantIds };
}

/** סימולציה של פנייה מימות המשיח */
export function phone(phoneNumber: string, answer?: string, extra: Record<string, string> = {}) {
  return api()
    .get('/api/yemot/call')
    .query({ key: YEMOT_KEY, ApiPhone: phoneNumber, ApiCallId: `call-${phoneNumber}`, ...(answer ? { answer } : {}), ...extra });
}

/** שליטה בשעון של השרת בבדיקות */
let fakeNow = 0;
export function freezeTime(start = Math.floor(Date.now() / 1000) * 1000) {
  vi.useFakeTimers({ toFake: ['Date'] });
  fakeNow = start;
  vi.setSystemTime(fakeNow);
}
export function advanceMs(ms: number) {
  fakeNow += ms;
  vi.setSystemTime(fakeNow);
}

export async function live(gameId: number, auth: Record<string, string>, afterAnswerId?: number) {
  const r = await api()
    .get(`/api/games/${gameId}/live`)
    .query(afterAnswerId !== undefined ? { afterAnswerId } : {})
    .set(auth);
  if (r.status !== 200) throw new Error(`live failed: ${r.status} ${JSON.stringify(r.body)}`);
  return r.body.live;
}
