import { describe, expect, it } from 'vitest';
import { PASSWORD, adminWithToken, api, createFullGame, createUser, hostWithToken } from './helpers';

describe('הרשאות מנהל', () => {
  it('מנחה לא יכול לגשת לנתיבי ניהול — 403', async () => {
    const host = await hostWithToken();
    for (const [method, url] of [
      ['get', '/api/admin/hosts'],
      ['post', '/api/admin/hosts'],
      ['patch', '/api/admin/hosts/1'],
      ['get', '/api/admin/games'],
    ] as const) {
      const res = await api()[method](url).set(host.auth).send({});
      expect(res.status, `${method} ${url}`).toBe(403);
    }
  });

  it('בלי Token — 401', async () => {
    const res = await api().get('/api/admin/hosts');
    expect(res.status).toBe(401);
  });
});

describe('ניהול מנחים', () => {
  it('יוצר מנחה, והמנחה יכול להתחבר', async () => {
    const admin = await adminWithToken();
    const res = await api().post('/api/admin/hosts').set(admin.auth).send({ name: 'חנה רוזן', email: 'hana@test.local', password: 'Hana12345' });
    expect(res.status).toBe(201);
    expect(res.body.host.role).toBe('HOST');
    const login = await api().post('/api/auth/login').send({ email: 'hana@test.local', password: 'Hana12345' });
    expect(login.status).toBe(200);
  });

  it('רשימה עם חיפוש וסינון חסומים, בלי מנהלים', async () => {
    const admin = await adminWithToken();
    await createUser('HOST', { name: 'רחל לוי' });
    await createUser('HOST', { name: 'מרים כהן', isBlocked: true });

    const all = await api().get('/api/admin/hosts').set(admin.auth);
    expect(all.status).toBe(200);
    expect(all.body.hosts).toHaveLength(2);
    expect(all.body.hosts.every((h: { role: string }) => h.role === 'HOST')).toBe(true);
    expect(JSON.stringify(all.body)).not.toContain('passwordHash');

    const search = await api().get('/api/admin/hosts').query({ search: 'רחל' }).set(admin.auth);
    expect(search.body.hosts.map((h: { name: string }) => h.name)).toEqual(['רחל לוי']);

    const blocked = await api().get('/api/admin/hosts').query({ blocked: 'true' }).set(admin.auth);
    expect(blocked.body.hosts.map((h: { name: string }) => h.name)).toEqual(['מרים כהן']);

    const bad = await api().get('/api/admin/hosts').query({ blocked: 'maybe' }).set(admin.auth);
    expect(bad.status).toBe(400);
  });

  it('חסימה ושחרור', async () => {
    const admin = await adminWithToken();
    const host = await createUser('HOST');

    const block = await api().patch(`/api/admin/hosts/${host.id}`).set(admin.auth).send({ isBlocked: true });
    expect(block.status).toBe(200);
    expect(block.body.host.isBlocked).toBe(true);
    expect((await api().post('/api/auth/login').send({ email: host.email, password: PASSWORD })).status).toBe(403);

    await api().patch(`/api/admin/hosts/${host.id}`).set(admin.auth).send({ isBlocked: false });
    expect((await api().post('/api/auth/login').send({ email: host.email, password: PASSWORD })).status).toBe(200);
  });

  it('אי אפשר לערוך מנהל דרך נתיב המנחים — 404', async () => {
    const admin = await adminWithToken();
    const res = await api().patch(`/api/admin/hosts/${admin.user.id}`).set(admin.auth).send({ isBlocked: true });
    expect(res.status).toBe(404);
  });

  it('אימייל כפול — 409, גוף ריק — 400', async () => {
    const admin = await adminWithToken();
    const host = await createUser('HOST');
    const dup = await api().post('/api/admin/hosts').set(admin.auth).send({ name: 'כפולה', email: host.email, password: 'Abcdefg1' });
    expect(dup.status).toBe(409);
    const empty = await api().patch(`/api/admin/hosts/${host.id}`).set(admin.auth).send({});
    expect(empty.status).toBe(400);
  });
});

describe('מנהל ומשחקים', () => {
  it('רואה את כל המשחקים, עם סינון לפי מנחה, סטטוס וחיפוש', async () => {
    const admin = await adminWithToken();
    const a = await hostWithToken('מנחה א');
    const b = await hostWithToken('מנחה ב');
    await createFullGame(a.auth, { title: 'חידון חשבון' });
    await createFullGame(b.auth, { title: 'חידון תנ״ך' });

    const all = await api().get('/api/admin/games').set(admin.auth);
    expect(all.body.games).toHaveLength(2);

    const byHost = await api().get('/api/admin/games').query({ hostId: b.user.id }).set(admin.auth);
    expect(byHost.body.games.map((g: { title: string }) => g.title)).toEqual(['חידון תנ״ך']);

    const search = await api().get('/api/admin/games').query({ search: 'חשבון' }).set(admin.auth);
    expect(search.body.games).toHaveLength(1);

    const status = await api().get('/api/admin/games').query({ status: 'RUNNING' }).set(admin.auth);
    expect(status.body.games).toHaveLength(0);
  });

  it('מנהל יכול לצפות ולמחוק, אבל לא ליצור, לערוך או להריץ', async () => {
    const admin = await adminWithToken();
    const host = await hostWithToken();
    const { gameId } = await createFullGame(host.auth);

    expect((await api().get(`/api/games/${gameId}`).set(admin.auth)).status).toBe(200);
    expect((await api().post('/api/games').set(admin.auth).send({ title: 'של המנהל' })).status).toBe(403);
    expect((await api().patch(`/api/games/${gameId}`).set(admin.auth).send({ title: 'שינוי' })).status).toBe(403);
    expect((await api().post(`/api/games/${gameId}/lobby`).set(admin.auth)).status).toBe(403);
    expect((await api().get(`/api/games/${gameId}/live`).set(admin.auth)).status).toBe(403);
    expect((await api().delete(`/api/games/${gameId}`).set(admin.auth)).status).toBe(204);
    expect((await api().get(`/api/games/${gameId}`).set(host.auth)).status).toBe(404);
  });
});
