import { describe, expect, it } from 'vitest';
import { api, competitive, createFullGame, hostWithToken, poll } from './helpers';

describe('משחקים — CRUD', () => {
  it('יצירה, צפייה, עריכה ומחיקה', async () => {
    const host = await hostWithToken();
    const created = await api().post('/api/games').set(host.auth).send({ title: '  חידון חנוכה  ', description: 'לכיתה ה׳' });
    expect(created.status).toBe(201);
    expect(created.body.game).toMatchObject({ title: 'חידון חנוכה', status: 'SETUP', questions: [], participants: [] });
    const id = created.body.game.id;

    const got = await api().get(`/api/games/${id}`).set(host.auth);
    expect(got.status).toBe(200);
    expect(got.body.game.host.id).toBe(host.user.id);

    const upd = await api().patch(`/api/games/${id}`).set(host.auth).send({ title: 'חידון חנוכה שמח' });
    expect(upd.status).toBe(200);
    expect(upd.body.game.title).toBe('חידון חנוכה שמח');

    expect((await api().delete(`/api/games/${id}`).set(host.auth)).status).toBe(204);
    expect((await api().get(`/api/games/${id}`).set(host.auth)).status).toBe(404);
  });

  it('ולידציה: שם קצר מדי, מזהה לא תקין', async () => {
    const host = await hostWithToken();
    const bad = await api().post('/api/games').set(host.auth).send({ title: 'א' });
    expect(bad.status).toBe(400);
    expect(bad.body.error.details[0].field).toBe('title');
    expect((await api().get('/api/games/abc').set(host.auth)).status).toBe(400);
    expect((await api().get('/api/games/999999').set(host.auth)).status).toBe(404);
  });

  it('המנחה המזוהה נקבע לפי ה-Token ולא לפי מה שנשלח', async () => {
    const a = await hostWithToken();
    const b = await hostWithToken();
    const res = await api().post('/api/games').set(a.auth).send({ title: 'משחק', hostId: b.user.id });
    expect(res.body.game.host.id).toBe(a.user.id);
  });
});

describe('פרטיות — מנחה לא רואה משחקים של אחרים', () => {
  it('כל פעולה על משחק של מנחה אחר מחזירה 404', async () => {
    const owner = await hostWithToken();
    const other = await hostWithToken();
    const { gameId, questionIds, participantIds } = await createFullGame(owner.auth);

    const attempts = [
      api().get(`/api/games/${gameId}`),
      api().patch(`/api/games/${gameId}`).send({ title: 'פריצה' }),
      api().delete(`/api/games/${gameId}`),
      api().post(`/api/games/${gameId}/duplicate`),
      api().post(`/api/games/${gameId}/participants`).send({ name: 'זרה', phone: '0509999999' }),
      api().patch(`/api/games/${gameId}/participants/${participantIds[0]}`).send({ name: 'x' }),
      api().delete(`/api/games/${gameId}/participants/${participantIds[0]}`),
      api().post(`/api/games/${gameId}/questions`).send(competitive('פריצה', 1)),
      api().patch(`/api/games/${gameId}/questions/${questionIds[0]}`).send({ text: 'פריצה' }),
      api().delete(`/api/games/${gameId}/questions/${questionIds[0]}`),
      api().post(`/api/games/${gameId}/lobby`),
      api().get(`/api/games/${gameId}/live`),
    ];
    for (const req of attempts) {
      const res = await req.set(other.auth);
      expect(res.status).toBe(404);
    }

    const list = await api().get('/api/games').set(other.auth);
    expect(list.body.games).toHaveLength(0);
  });
});

describe('רשימה — חיפוש, סינון ומיון', () => {
  it('search, status ו-sort', async () => {
    const host = await hostWithToken();
    for (const title of ['בגיאוגרפיה', 'אלף בית', 'גשם ושלג']) {
      await api().post('/api/games').set(host.auth).send({ title });
    }
    const all = await api().get('/api/games').set(host.auth);
    expect(all.body.games.map((g: { title: string }) => g.title)).toEqual(['גשם ושלג', 'אלף בית', 'בגיאוגרפיה']);

    const byTitle = await api().get('/api/games').query({ sort: 'title' }).set(host.auth);
    expect(byTitle.body.games.map((g: { title: string }) => g.title)).toEqual(['אלף בית', 'בגיאוגרפיה', 'גשם ושלג']);

    const oldest = await api().get('/api/games').query({ sort: 'oldest' }).set(host.auth);
    expect(oldest.body.games[0].title).toBe('בגיאוגרפיה');

    const search = await api().get('/api/games').query({ search: 'שלג' }).set(host.auth);
    expect(search.body.games.map((g: { title: string }) => g.title)).toEqual(['גשם ושלג']);

    const status = await api().get('/api/games').query({ status: 'SETUP' }).set(host.auth);
    expect(status.body.games).toHaveLength(3);

    expect((await api().get('/api/games').query({ status: 'NOPE' }).set(host.auth)).status).toBe(400);
    expect((await api().get('/api/games').query({ sort: 'random' }).set(host.auth)).status).toBe(400);
  });

  it('הרשימה כוללת מספר שאלות ומשתתפים', async () => {
    const host = await hostWithToken();
    await createFullGame(host.auth);
    const res = await api().get('/api/games').set(host.auth);
    expect(res.body.games[0]).toMatchObject({ questionsCount: 2, participantsCount: 2 });
  });
});

describe('משתתפים', () => {
  it('הטלפון נשמר בפורמט אחיד, טלפון כפול באותו משחק — 409', async () => {
    const host = await hostWithToken();
    const { gameId } = await createFullGame(host.auth, { participants: [] });
    const a = await api().post(`/api/games/${gameId}/participants`).set(host.auth).send({ name: 'שירה', phone: '+972-50-123-4567' });
    expect(a.status).toBe(201);
    expect(a.body.participant.phone).toBe('0501234567');

    const dup = await api().post(`/api/games/${gameId}/participants`).set(host.auth).send({ name: 'אחרת', phone: '050 123 4567' });
    expect(dup.status).toBe(409);
  });

  it('טלפון לא תקין — 400', async () => {
    const host = await hostWithToken();
    const { gameId } = await createFullGame(host.auth, { participants: [] });
    const res = await api().post(`/api/games/${gameId}/participants`).set(host.auth).send({ name: 'שירה', phone: '123' });
    expect(res.status).toBe(400);
    expect(res.body.error.details[0].field).toBe('phone');
  });

  it('עריכה ומחיקה', async () => {
    const host = await hostWithToken();
    const { gameId, participantIds } = await createFullGame(host.auth);
    const upd = await api().patch(`/api/games/${gameId}/participants/${participantIds[0]}`).set(host.auth).send({ name: 'שירה כהן' });
    expect(upd.status).toBe(200);
    expect(upd.body.participant.name).toBe('שירה כהן');
    expect((await api().delete(`/api/games/${gameId}/participants/${participantIds[0]}`).set(host.auth)).status).toBe(204);
    expect((await api().delete(`/api/games/${gameId}/participants/${participantIds[0]}`).set(host.auth)).status).toBe(404);
  });

  it('אותו טלפון מותר בשני משחקים שונים (כשהם לא פעילים)', async () => {
    const host = await hostWithToken();
    const p = [{ name: 'שירה', phone: '0500000101' }];
    await createFullGame(host.auth, { participants: p });
    await expect(createFullGame(host.auth, { participants: p })).resolves.toBeTruthy();
  });
});

describe('שאלות', () => {
  it('תחרותית בלי תשובה נכונה — 400; סקר עם תשובה נכונה — 400', async () => {
    const host = await hostWithToken();
    const { gameId } = await createFullGame(host.auth, { questions: [] });
    const noCorrect = await api().post(`/api/games/${gameId}/questions`).set(host.auth).send({ ...competitive('שאלה', 1), correctOption: null });
    expect(noCorrect.status).toBe(400);
    const pollWithCorrect = await api().post(`/api/games/${gameId}/questions`).set(host.auth).send({ ...poll('סקר'), correctOption: 2 });
    expect(pollWithCorrect.status).toBe(400);
    const outOfRange = await api().post(`/api/games/${gameId}/questions`).set(host.auth).send(competitive('שאלה', 5));
    expect(outOfRange.status).toBe(400);
  });

  it('ארבע תשובות חייבות להיות שונות', async () => {
    const host = await hostWithToken();
    const { gameId } = await createFullGame(host.auth, { questions: [] });
    const res = await api()
      .post(`/api/games/${gameId}/questions`)
      .set(host.auth)
      .send({ type: 'COMPETITIVE', text: 'שאלה', option1: 'כן', option2: 'לא', option3: 'כן', option4: 'אולי', correctOption: 1 });
    expect(res.status).toBe(400);
  });

  it('סוג ברירת מחדל: תחרותית; סדר עולה אוטומטית', async () => {
    const host = await hostWithToken();
    const { gameId } = await createFullGame(host.auth, { questions: [] });
    const q1 = await api().post(`/api/games/${gameId}/questions`).set(host.auth).send({ text: 'אחת', option1: 'א', option2: 'ב', option3: 'ג', option4: 'ד', correctOption: 1 });
    const q2 = await api().post(`/api/games/${gameId}/questions`).set(host.auth).send(poll('שתיים'));
    expect(q1.body.question).toMatchObject({ type: 'COMPETITIVE', order: 1 });
    expect(q2.body.question).toMatchObject({ type: 'POLL', order: 2, correctOption: null });
  });

  it('עריכה: מעבר לסקר מנקה תשובה נכונה, מעבר לתחרותית מחייב תשובה', async () => {
    const host = await hostWithToken();
    const { gameId, questionIds } = await createFullGame(host.auth, { questions: [competitive('שאלה', 2)] });
    const toPoll = await api().patch(`/api/games/${gameId}/questions/${questionIds[0]}`).set(host.auth).send({ type: 'POLL' });
    expect(toPoll.status).toBe(200);
    expect(toPoll.body.question.correctOption).toBeNull();

    const back = await api().patch(`/api/games/${gameId}/questions/${questionIds[0]}`).set(host.auth).send({ type: 'COMPETITIVE' });
    expect(back.status).toBe(400);
    const backOk = await api().patch(`/api/games/${gameId}/questions/${questionIds[0]}`).set(host.auth).send({ type: 'COMPETITIVE', correctOption: 4 });
    expect(backOk.status).toBe(200);
    expect(backOk.body.question.correctOption).toBe(4);
  });

  it('מחיקה מסדרת מחדש את המספור; שינוי סדר', async () => {
    const host = await hostWithToken();
    const { gameId, questionIds } = await createFullGame(host.auth, {
      questions: [competitive('שאלה א', 1), competitive('שאלה ב', 2), competitive('שאלה ג', 3)],
    });
    expect((await api().delete(`/api/games/${gameId}/questions/${questionIds[0]}`).set(host.auth)).status).toBe(204);
    let game = (await api().get(`/api/games/${gameId}`).set(host.auth)).body.game;
    expect(game.questions.map((q: { text: string; order: number }) => [q.text, q.order])).toEqual([['שאלה ב', 1], ['שאלה ג', 2]]);

    const reorder = await api().put(`/api/games/${gameId}/questions/order`).set(host.auth).send({ questionIds: [questionIds[2], questionIds[1]] });
    expect(reorder.status).toBe(200);
    game = (await api().get(`/api/games/${gameId}`).set(host.auth)).body.game;
    expect(game.questions.map((q: { text: string }) => q.text)).toEqual(['שאלה ג', 'שאלה ב']);

    const missing = await api().put(`/api/games/${gameId}/questions/order`).set(host.auth).send({ questionIds: [questionIds[2]] });
    expect(missing.status).toBe(400);
    const dupIds = await api().put(`/api/games/${gameId}/questions/order`).set(host.auth).send({ questionIds: [questionIds[2], questionIds[2]] });
    expect(dupIds.status).toBe(400);
  });
});

describe('שכפול', () => {
  it('מעתיק שאלות ומשתתפים למשחק חדש בהכנה', async () => {
    const host = await hostWithToken();
    const { gameId } = await createFullGame(host.auth, { title: 'המקור' });
    const res = await api().post(`/api/games/${gameId}/duplicate`).set(host.auth);
    expect(res.status).toBe(201);
    expect(res.body.game).toMatchObject({ title: 'המקור (עותק)', status: 'SETUP' });
    expect(res.body.game.questions).toHaveLength(2);
    expect(res.body.game.participants).toHaveLength(2);
    expect(res.body.game.id).not.toBe(gameId);
  });
});

describe('נעילת עריכה בזמן משחק', () => {
  it('בלובי אי אפשר לערוך או למחוק; אחרי stop אפשר', async () => {
    const host = await hostWithToken();
    const { gameId, questionIds } = await createFullGame(host.auth);
    expect((await api().post(`/api/games/${gameId}/lobby`).set(host.auth)).status).toBe(200);

    expect((await api().patch(`/api/games/${gameId}`).set(host.auth).send({ title: 'חדש' })).status).toBe(409);
    expect((await api().post(`/api/games/${gameId}/questions`).set(host.auth).send(competitive('חדשה', 1))).status).toBe(409);
    expect((await api().delete(`/api/games/${gameId}/questions/${questionIds[0]}`).set(host.auth)).status).toBe(409);
    expect((await api().delete(`/api/games/${gameId}`).set(host.auth)).status).toBe(409);

    expect((await api().post(`/api/games/${gameId}/stop`).set(host.auth)).status).toBe(200);
    expect((await api().patch(`/api/games/${gameId}`).set(host.auth).send({ title: 'חדש' })).status).toBe(200);
  });
});
