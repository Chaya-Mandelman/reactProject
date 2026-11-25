import { describe, expect, it } from 'vitest';
import { prisma } from '../src/db/prisma';
import { api, competitive, createFullGame, hostWithToken, poll } from './helpers';

describe('הוספת הרבה שאלות בבת אחת', () => {
  it('מוסיף בסוף הרשימה, לפי הסדר', async () => {
    const host = await hostWithToken();
    const { gameId } = await createFullGame(host.auth); // כבר יש 2 שאלות
    const res = await api()
      .post(`/api/games/${gameId}/questions/bulk`)
      .set(host.auth)
      .send({ questions: [competitive('חדשה 1', 1), poll('סקר חדש'), { ...competitive('בלי סוג', 4), type: undefined }] });
    expect(res.status).toBe(201);
    expect(res.body.questions.map((q: { order: number; text: string; type: string }) => [q.order, q.text, q.type])).toEqual([
      [3, 'חדשה 1', 'COMPETITIVE'],
      [4, 'סקר חדש', 'POLL'],
      [5, 'בלי סוג', 'COMPETITIVE'],
    ]);
    expect(res.body.questions[1]).toMatchObject({ correctOption: null, imageId: null });
  });

  it('שאלה אחת לא תקינה — אף שאלה לא נשמרת, והשגיאה מצביעה על השורה', async () => {
    const host = await hostWithToken();
    const { gameId } = await createFullGame(host.auth);
    const res = await api()
      .post(`/api/games/${gameId}/questions/bulk`)
      .set(host.auth)
      .send({ questions: [competitive('תקינה', 1), { ...competitive('בלי תשובה נכונה', 1), correctOption: null }, { ...poll('כפולות'), option2: 'אפשרות א' }] });
    expect(res.status).toBe(400);
    const fields = res.body.error.details.map((d: { field: string }) => d.field);
    expect(fields).toContain('questions.1.correctOption');
    expect(fields).toContain('questions.2.option1');
    expect(await prisma.question.count({ where: { gameId } })).toBe(2);
  });

  it('רשימה ריקה, גדולה מדי, משחק פעיל ומנחה אחרת', async () => {
    const host = await hostWithToken();
    const other = await hostWithToken();
    const { gameId } = await createFullGame(host.auth);
    const url = `/api/games/${gameId}/questions/bulk`;
    expect((await api().post(url).set(host.auth).send({ questions: [] })).status).toBe(400);
    expect((await api().post(url).set(host.auth).send({ questions: Array.from({ length: 51 }, (_, i) => competitive(`ש${i}`, 1)) })).status).toBe(400);
    expect((await api().post(url).set(other.auth).send({ questions: [competitive('פריצה', 1)] })).status).toBe(404);
    await api().post(`/api/games/${gameId}/lobby`).set(host.auth);
    expect((await api().post(url).set(host.auth).send({ questions: [competitive('בלובי', 1)] })).status).toBe(409);
  });
});

describe('הוספת הרבה משתתפים בבת אחת', () => {
  it('מוסיף את כולם ומנרמל טלפונים', async () => {
    const host = await hostWithToken();
    const { gameId } = await createFullGame(host.auth);
    const res = await api()
      .post(`/api/games/${gameId}/participants/bulk`)
      .set(host.auth)
      .send({ participants: [{ name: 'רות', phone: '050-000-0201' }, { name: 'מיכל', phone: '+972500000202' }] });
    expect(res.status).toBe(201);
    expect(res.body.participants.map((p: { phone: string }) => p.phone)).toEqual(['0500000201', '0500000202']);
    expect(await prisma.participant.count({ where: { gameId } })).toBe(4);
  });

  it('טלפון כפול ברשימה או מול הרשומים — אף אחד לא נשמר', async () => {
    const host = await hostWithToken();
    const { gameId } = await createFullGame(host.auth); // 0500000101 כבר רשום
    const res = await api()
      .post(`/api/games/${gameId}/participants/bulk`)
      .set(host.auth)
      .send({
        participants: [
          { name: 'חדשה', phone: '0500000301' },
          { name: 'כפולה ברשימה', phone: '050-000-0301' },
          { name: 'כבר רשומה', phone: '0500000101' },
        ],
      });
    expect(res.status).toBe(409);
    expect(res.body.error.details.map((d: { field: string }) => d.field)).toEqual(['participants.1.phone', 'participants.2.phone']);
    expect(await prisma.participant.count({ where: { gameId } })).toBe(2);
  });

  it('טלפון לא תקין מחזיר שגיאה לשורה', async () => {
    const host = await hostWithToken();
    const { gameId } = await createFullGame(host.auth);
    const res = await api()
      .post(`/api/games/${gameId}/participants/bulk`)
      .set(host.auth)
      .send({ participants: [{ name: 'תקינה', phone: '0500000401' }, { name: 'שגויה', phone: '123' }] });
    expect(res.status).toBe(400);
    expect(res.body.error.details[0].field).toBe('participants.1.phone');
  });
});
