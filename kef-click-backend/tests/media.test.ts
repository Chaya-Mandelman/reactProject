import { describe, expect, it } from 'vitest';
import { prisma } from '../src/db/prisma';
import { api, createFullGame, hostWithToken, live } from './helpers';

// PNG אמיתי בגודל פיקסל אחד
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
);

const uploadImage = (gameId: number, qid: number, auth: Record<string, string>, body: Buffer, type = 'image/png') =>
  api().put(`/api/games/${gameId}/questions/${qid}/image`).set(auth).set('Content-Type', type).send(body);

describe('תמונה לשאלה', () => {
  it('העלאה, הצגה ציבורית, החלפה ומחיקה', async () => {
    const host = await hostWithToken();
    const { gameId, questionIds } = await createFullGame(host.auth);
    const qid = questionIds[0]!;

    const up = await uploadImage(gameId, qid, host.auth, PNG);
    expect(up.status).toBe(200);
    const imageId = up.body.imageId as string;

    // מופיע בפרטי המשחק
    const details = await api().get(`/api/games/${gameId}`).set(host.auth);
    expect(details.body.game.questions[0].imageId).toBe(imageId);
    expect(details.body.game.questions[1].imageId).toBeNull();

    // הצגה בלי Token, עם הסוג הנכון וזיכרון ארוך
    const img = await api().get(`/api/media/${imageId}`).buffer(true).parse((res, cb) => {
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end', () => cb(null, Buffer.concat(chunks)));
    });
    expect(img.status).toBe(200);
    expect(img.headers['content-type']).toBe('image/png');
    expect(img.headers['cache-control']).toContain('immutable');
    expect(Buffer.compare(img.body as Buffer, PNG)).toBe(0);

    // החלפה = מזהה חדש, הישן כבר לא קיים
    const again = await uploadImage(gameId, qid, host.auth, PNG);
    expect(again.body.imageId).not.toBe(imageId);
    expect((await api().get(`/api/media/${imageId}`)).status).toBe(404);

    expect((await api().delete(`/api/games/${gameId}/questions/${qid}/image`).set(host.auth)).status).toBe(204);
    expect((await api().get(`/api/media/${again.body.imageId}`)).status).toBe(404);
  });

  it('סוג הקובץ נבדק לפי התוכן ולא לפי הכותרת', async () => {
    const host = await hostWithToken();
    const { gameId, questionIds } = await createFullGame(host.auth);
    const fake = await uploadImage(gameId, questionIds[0]!, host.auth, Buffer.from('<script>alert(1)</script>'));
    expect(fake.status).toBe(400);
    const empty = await uploadImage(gameId, questionIds[0]!, host.auth, Buffer.alloc(0));
    expect(empty.status).toBe(400);
  });

  it('קובץ גדול מ-2MB נדחה', async () => {
    const host = await hostWithToken();
    const { gameId, questionIds } = await createFullGame(host.auth);
    const big = Buffer.concat([PNG, Buffer.alloc(2 * 1024 * 1024)]);
    const res = await uploadImage(gameId, questionIds[0]!, host.auth, big);
    expect(res.status).toBe(413);
  });

  it('מנחה אחרת לא יכולה להעלות או למחוק, ואי אפשר לערוך במשחק פעיל', async () => {
    const owner = await hostWithToken();
    const other = await hostWithToken();
    const { gameId, questionIds } = await createFullGame(owner.auth);
    const qid = questionIds[0]!;

    expect((await uploadImage(gameId, qid, other.auth, PNG)).status).toBe(404);
    expect((await api().delete(`/api/games/${gameId}/questions/${qid}/image`).set(other.auth)).status).toBe(404);
    expect((await uploadImage(gameId, 999999, owner.auth, PNG)).status).toBe(404);
    expect((await api().put(`/api/games/${gameId}/questions/${qid}/image`).send(PNG)).status).toBe(401);

    await api().post(`/api/games/${gameId}/lobby`).set(owner.auth);
    expect((await uploadImage(gameId, qid, owner.auth, PNG)).status).toBe(409);
  });

  it('מזהה תמונה לא תקין או לא קיים', async () => {
    expect((await api().get('/api/media/not-a-uuid')).status).toBe(400);
    expect((await api().get('/api/media/00000000-0000-4000-8000-000000000000')).status).toBe(404);
  });

  it('התמונה מופיעה במצב החי, מועתקת בשכפול ונמחקת עם השאלה', async () => {
    const host = await hostWithToken();
    const { gameId, questionIds } = await createFullGame(host.auth);
    const up = await uploadImage(gameId, questionIds[0]!, host.auth, PNG);

    const dup = await api().post(`/api/games/${gameId}/duplicate`).set(host.auth);
    const copyImageId = dup.body.game.questions[0].imageId as string;
    expect(copyImageId).toBeTruthy();
    expect(copyImageId).not.toBe(up.body.imageId);
    expect(dup.body.game.questions[1].imageId).toBeNull();

    await api().post(`/api/games/${gameId}/lobby`).set(host.auth);
    await api().post(`/api/games/${gameId}/start`).set(host.auth);
    const state = await live(gameId, host.auth);
    expect(state.question.imageId).toBe(up.body.imageId);
    await api().post(`/api/games/${gameId}/stop`).set(host.auth);

    await api().delete(`/api/games/${gameId}/questions/${questionIds[0]}`).set(host.auth);
    expect(await prisma.questionMedia.count({ where: { id: up.body.imageId } })).toBe(0);
    // התמונה של העותק לא נפגעה
    expect((await api().get(`/api/media/${copyImageId}`)).status).toBe(200);
  });
});
