import jwt from 'jsonwebtoken';
import { describe, expect, it } from 'vitest';
import { PASSWORD, api, createUser, tokenFor } from './helpers';

describe('הרשמה', () => {
  it('נרשמת כמנחה, מקבלת Token ומחוברת מיד', async () => {
    const res = await api().post('/api/auth/register').send({ name: 'מרים אדלר', email: 'Miriam@Example.com', password: 'Secret123' });
    expect(res.status).toBe(201);
    expect(res.body.user).toMatchObject({ name: 'מרים אדלר', email: 'miriam@example.com', role: 'HOST' });
    expect(res.body.user.passwordHash).toBeUndefined();

    const me = await api().get('/api/auth/me').set('Authorization', `Bearer ${res.body.token}`);
    expect(me.status).toBe(200);
    expect(me.body.user.email).toBe('miriam@example.com');
  });

  it('אי אפשר להירשם כמנהל גם אם שולחים role', async () => {
    const res = await api().post('/api/auth/register').send({ name: 'פורצת', email: 'x@x.com', password: 'Secret123', role: 'ADMIN' });
    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe('HOST');
  });

  it('אימייל קיים — 409', async () => {
    await api().post('/api/auth/register').send({ name: 'אחת', email: 'a@a.com', password: 'Secret123' });
    const res = await api().post('/api/auth/register').send({ name: 'שתיים', email: 'A@A.com', password: 'Secret123' });
    expect(res.status).toBe(409);
  });

  it('סיסמה חלשה ואימייל שגוי — 400 עם פירוט שדות', async () => {
    const res = await api().post('/api/auth/register').send({ name: 'א', email: 'not-an-email', password: '123' });
    expect(res.status).toBe(400);
    const fields = res.body.error.details.map((d: { field: string }) => d.field);
    expect(fields).toEqual(expect.arrayContaining(['name', 'email', 'password']));
  });
});

describe('התחברות', () => {
  it('Login תקין מחזיר Token ופרטי משתמש בלי סיסמה', async () => {
    const user = await createUser('HOST');
    const res = await api().post('/api/auth/login').send({ email: user.email, password: PASSWORD });
    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe('string');
    expect(res.body.user).toMatchObject({ id: user.id, role: 'HOST' });
    expect(JSON.stringify(res.body)).not.toContain('passwordHash');
  });

  it('Login עם סיסמה שגויה — 401', async () => {
    const user = await createUser('HOST');
    const res = await api().post('/api/auth/login').send({ email: user.email, password: 'wrong-pass1' });
    expect(res.status).toBe(401);
  });

  it('Login עם אימייל לא קיים — 401 (אותה הודעה)', async () => {
    const res = await api().post('/api/auth/login').send({ email: 'nobody@test.local', password: 'whatever1' });
    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('אימייל או סיסמה שגויים');
  });

  it('Login בלי שדות — 400', async () => {
    const res = await api().post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });

  it('JSON שבור — 400', async () => {
    const res = await api().post('/api/auth/login').set('Content-Type', 'application/json').send('{"email":');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('BAD_JSON');
  });

  it('מנחה חסום לא יכול להתחבר — 403', async () => {
    const user = await createUser('HOST', { isBlocked: true });
    const res = await api().post('/api/auth/login').send({ email: user.email, password: PASSWORD });
    expect(res.status).toBe(403);
  });
});

describe('Token', () => {
  it('בלי Token — 401', async () => {
    const res = await api().get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('Token מזויף — 401', async () => {
    const res = await api().get('/api/auth/me').set('Authorization', 'Bearer abc.def.ghi');
    expect(res.status).toBe(401);
  });

  it('Token שנחתם במפתח אחר — 401', async () => {
    const user = await createUser('HOST');
    const fake = jwt.sign({ role: 'ADMIN' }, 'some-other-secret-some-other-secret', { subject: String(user.id) });
    const res = await api().get('/api/auth/me').set('Authorization', `Bearer ${fake}`);
    expect(res.status).toBe(401);
  });

  it('Token שפג תוקפו — 401 עם הודעה מתאימה', async () => {
    const user = await createUser('HOST');
    const expired = jwt.sign({ role: 'HOST' }, process.env.JWT_SECRET!, { subject: String(user.id), expiresIn: -10 });
    const res = await api().get('/api/auth/me').set('Authorization', `Bearer ${expired}`);
    expect(res.status).toBe(401);
    expect(res.body.error.message).toContain('פג תוקף');
  });

  it('בלי המילה Bearer — 401', async () => {
    const user = await createUser('HOST');
    const token = await tokenFor(user.email);
    const res = await api().get('/api/auth/me').set('Authorization', token);
    expect(res.status).toBe(401);
  });

  it('חסימה נכנסת לתוקף מיד גם ל-Token קיים — 403', async () => {
    const user = await createUser('HOST');
    const token = await tokenFor(user.email);
    const { prisma } = await import('../src/db/prisma');
    await prisma.user.update({ where: { id: user.id }, data: { isBlocked: true } });
    const res = await api().get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('התפקיד נקבע לפי מסד הנתונים ולא לפי מה שכתוב ב-Token', async () => {
    const user = await createUser('HOST');
    const forged = jwt.sign({ role: 'ADMIN' }, process.env.JWT_SECRET!, { subject: String(user.id), expiresIn: 60 });
    const res = await api().get('/api/admin/hosts').set('Authorization', `Bearer ${forged}`);
    expect(res.status).toBe(403);
  });
});
