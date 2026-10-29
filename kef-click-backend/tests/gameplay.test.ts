import { describe, expect, it } from 'vitest';
import { prisma } from '../src/db/prisma';
import { advanceMs, api, competitive, createFullGame, freezeTime, hostWithToken, live, phone, poll } from './helpers';

const SHIRA = '0500000101';
const NOA = '0500000102';

async function setupRunningGame(questions?: Record<string, unknown>[]) {
  const host = await hostWithToken();
  const ids = await createFullGame(host.auth, { questions });
  freezeTime();
  expect((await api().post(`/api/games/${ids.gameId}/lobby`).set(host.auth)).status).toBe(200);
  await phone(SHIRA);
  await phone(NOA);
  expect((await api().post(`/api/games/${ids.gameId}/start`).set(host.auth)).status).toBe(200);
  return { host, ...ids };
}

describe('לובי וחיבור טלפוני', () => {
  it('לובי דורש שאלה ומשתתף', async () => {
    const host = await hostWithToken();
    const noQ = await createFullGame(host.auth, { questions: [] });
    expect((await api().post(`/api/games/${noQ.gameId}/lobby`).set(host.auth)).status).toBe(409);
    const noP = await createFullGame(host.auth, { participants: [] });
    expect((await api().post(`/api/games/${noP.gameId}/lobby`).set(host.auth)).status).toBe(409);
  });

  it('משתתפת שמתקשרת מסומנת "מחוברת" ושומעת ברכה', async () => {
    const host = await hostWithToken();
    const { gameId } = await createFullGame(host.auth, { title: 'חידון שבוע' });
    await api().post(`/api/games/${gameId}/lobby`).set(host.auth);

    let state = await live(gameId, host.auth);
    expect(state.phase).toBe('LOBBY');
    expect(state.connectedCount).toBe(0);

    const res = await phone(SHIRA);
    expect(res.status).toBe(200);
    expect(res.type).toBe('text/plain');
    expect(res.text).toContain('t-שלום שירה');
    expect(res.text).toContain('read=');

    state = await live(gameId, host.auth);
    expect(state.connectedCount).toBe(1);
    expect(state.participants.find((p: { name: string }) => p.name === 'שירה').connected).toBe(true);
    expect(state.participants.find((p: { name: string }) => p.name === 'נועה').connected).toBe(false);
  });

  it('ניתוק שיחה — המשתתפת כבר לא מחוברת', async () => {
    const host = await hostWithToken();
    const { gameId } = await createFullGame(host.auth);
    await api().post(`/api/games/${gameId}/lobby`).set(host.auth);
    await phone(SHIRA);
    const res = await phone(SHIRA, '2', { hangup: 'yes' });
    expect(res.status).toBe(200);
    expect((await live(gameId, host.auth)).connectedCount).toBe(0);
  });

  it('טלפון לא רשום — הודעה וניתוק', async () => {
    const res = await phone('0509999999');
    expect(res.text).toContain('אינו רשום');
    expect(res.text).toContain('go_to_folder=hangup');
  });

  it('מספר חסוי — הודעה וניתוק', async () => {
    const res = await phone('');
    expect(res.text).toContain('לא ניתן לזהות');
    expect(res.text).toContain('go_to_folder=hangup');
  });

  it('מפתח ימות המשיח שגוי — 403', async () => {
    const res = await api().get('/api/yemot/call').query({ key: 'wrong', ApiPhone: SHIRA });
    expect(res.status).toBe(403);
    const noKey = await api().get('/api/yemot/call').query({ ApiPhone: SHIRA });
    expect(noKey.status).toBe(403);
  });

  it('עובד גם ב-POST (api_url_post=yes)', async () => {
    const host = await hostWithToken();
    const { gameId } = await createFullGame(host.auth);
    await api().post(`/api/games/${gameId}/lobby`).set(host.auth);
    const res = await api().post('/api/yemot/call').type('form').send({ key: 'test-yemot-secret', ApiPhone: SHIRA });
    expect(res.status).toBe(200);
    expect(res.text).toContain('שלום שירה');
  });

  it('טלפון יכול להיות במשחק פעיל אחד בלבד', async () => {
    const a = await hostWithToken();
    const b = await hostWithToken();
    const g1 = await createFullGame(a.auth, { participants: [{ name: 'שירה', phone: SHIRA }] });
    const g2 = await createFullGame(b.auth, { participants: [{ name: 'שירה', phone: SHIRA }] });

    expect((await api().post(`/api/games/${g1.gameId}/lobby`).set(a.auth)).status).toBe(200);
    const conflict = await api().post(`/api/games/${g2.gameId}/lobby`).set(b.auth);
    expect(conflict.status).toBe(409);
    expect(conflict.body.error.details[0]).toMatchObject({ phone: SHIRA, gameId: g1.gameId });

    await api().post(`/api/games/${g1.gameId}/stop`).set(a.auth);
    expect((await api().post(`/api/games/${g2.gameId}/lobby`).set(b.auth)).status).toBe(200);
  });

  it('מעברי מצב לא חוקיים — 409', async () => {
    const host = await hostWithToken();
    const { gameId } = await createFullGame(host.auth);
    expect((await api().post(`/api/games/${gameId}/start`).set(host.auth)).status).toBe(409);
    expect((await api().post(`/api/games/${gameId}/pause`).set(host.auth)).status).toBe(409);
    expect((await api().post(`/api/games/${gameId}/resume`).set(host.auth)).status).toBe(409);
    expect((await api().post(`/api/games/${gameId}/stop`).set(host.auth)).status).toBe(409);
    expect((await api().post(`/api/games/${gameId}/next`).set(host.auth)).status).toBe(409);
    await api().post(`/api/games/${gameId}/lobby`).set(host.auth);
    expect((await api().post(`/api/games/${gameId}/lobby`).set(host.auth)).status).toBe(409);
  });
});

describe('משחק מלא — ניקוד, מהירות, חשיפה, השהיה וסיום', () => {
  it('תרחיש שלם מתחילתו ועד סופו', async () => {
    const { host, gameId } = await setupRunningGame([competitive('שאלה 1', 2), competitive('שאלה 2', 3)]);

    // ===== שאלה 1 נפתחה =====
    let state = await live(gameId, host.auth);
    expect(state.phase).toBe('QUESTION');
    expect(state.questionNumber).toBe(1);
    expect(state.totalQuestions).toBe(2);
    expect(state.timeLeftMs).toBe(60_000);
    expect(state.question.correctOption).toBeUndefined(); // התשובה הנכונה מוסתרת בזמן שאלה
    expect(state.question.options).toHaveLength(4);

    // שירה עונה נכון אחרי 3.4 שניות → שנייה 3 → 970
    advanceMs(3_400);
    let res = await phone(SHIRA, '2');
    expect(res.text).toContain('תשובה נכונה 970 נקודות');
    expect(res.text).toContain('read=');

    state = await live(gameId, host.auth);
    expect(state.answeredCount).toBe(1);
    expect(state.recentAnswers.map((a: { name: string }) => a.name)).toEqual(['שירה']);
    expect(state.fastest).toEqual([{ participantId: expect.any(Number), name: 'שירה', responseMs: 3_400 }]);
    expect(state.timeLeftMs).toBe(56_600);
    const afterId = state.lastAnswerId;

    // תשובה שנייה לאותה שאלה לא נספרת
    res = await phone(SHIRA, '1');
    expect(res.text).toContain('כבר עניתם');

    // מקש לא חוקי
    res = await phone(NOA, '7');
    expect(res.text).toContain('read=');
    expect((await live(gameId, host.auth)).answeredCount).toBe(1);

    // נועה עונה לא נכון — וכולן ענו → השאלה נסגרת מיד
    advanceMs(1_000);
    res = await phone(NOA, '1');
    expect(res.text).toContain('תשובה שגויה');

    state = await live(gameId, host.auth, afterId);
    expect(state.phase).toBe('REVEAL');
    expect(state.recentAnswers.map((a: { name: string }) => a.name)).toEqual(['נועה']); // רק החדשות
    expect(state.fastest.map((f: { name: string }) => f.name)).toEqual(['שירה']); // רק נכונות
    expect(state.question.correctOption).toBe(2);
    expect(state.reveal.distribution).toEqual([1, 1, 0, 0]);
    expect(state.reveal.leaderboard.map((r: { name: string; score: number }) => [r.name, r.score])).toEqual([
      ['שירה', 970],
      ['נועה', 0],
    ]);

    // בזמן החשיפה — מאוחר מדי
    res = await phone(NOA, '3');
    expect(res.text).toContain('הזמן לשאלה הזו הסתיים');

    // ===== המנחה עוברת לשאלה 2 =====
    expect((await api().post(`/api/games/${gameId}/next`).set(host.auth)).status).toBe(200);
    state = await live(gameId, host.auth);
    expect(state.phase).toBe('QUESTION');
    expect(state.questionNumber).toBe(2);
    expect(state.timeLeftMs).toBe(60_000);
    expect(state.isLastQuestion).toBe(true);

    // ===== השהיה: הטיימר נעצר ותשובות לא נקלטות =====
    advanceMs(10_000);
    await api().post(`/api/games/${gameId}/pause`).set(host.auth);
    advanceMs(30_000);
    state = await live(gameId, host.auth);
    expect(state.paused).toBe(true);
    expect(state.timeLeftMs).toBe(50_000);
    res = await phone(SHIRA, '3');
    expect(res.text).toContain('מושהה');
    expect(state.answeredCount).toBe(0);

    // ===== המשך: זמן ההשהיה לא נספר =====
    await api().post(`/api/games/${gameId}/resume`).set(host.auth);
    advanceMs(2_000);
    res = await phone(SHIRA, '3'); // 12 שניות נטו → 1000 - 120 = 880
    expect(res.text).toContain('880');
    state = await live(gameId, host.auth);
    expect(state.timeLeftMs).toBe(48_000);
    expect(state.paused).toBe(false);

    // נועה לא עונה — אחרי 60 שניות השאלה נסגרת
    advanceMs(48_000);
    state = await live(gameId, host.auth);
    expect(state.phase).toBe('REVEAL');

    // ===== אחרי השאלה האחרונה "הבא" מסיים את המשחק =====
    expect((await api().post(`/api/games/${gameId}/next`).set(host.auth)).status).toBe(200);
    state = await live(gameId, host.auth);
    expect(state.phase).toBe('FINISHED');
    expect(state.game.status).toBe('FINISHED');
    expect(state.summary.winners[0]).toMatchObject({ rank: 1, name: 'שירה', score: 1_850, correctCount: 2 });
    expect(state.summary.leaderboard).toHaveLength(2);

    // טלפון אחרי הסיום — שומעים את התוצאה ומתנתקים
    res = await phone(SHIRA);
    expect(res.text).toContain('המשחק הסתיים');
    expect(res.text).toContain('1850');
    expect(res.text).toContain('go_to_folder=hangup');

    // ===== משחק חוזר: הניקוד והתשובות מתאפסים, השאלות והמשתתפים נשארים =====
    await api().post(`/api/games/${gameId}/lobby`).set(host.auth);
    expect(await prisma.answer.count()).toBe(0);
    const ps = await prisma.participant.findMany({ where: { gameId } });
    expect(ps.every((p) => p.score === 0 && p.connectedAt === null)).toBe(true);
    expect(await prisma.question.count({ where: { gameId } })).toBe(2);
  });

  it('טבלת הניקוד לפי השניות: כל שנייה מורידה 10, שנייה 59 = 410', async () => {
    const { host, gameId } = await setupRunningGame([competitive('שאלה', 1)]);
    advanceMs(999);
    expect((await phone(SHIRA, '1')).text).toContain('1000 נקודות');
    advanceMs(59_999 - 999);
    expect((await phone(NOA, '1')).text).toContain('410 נקודות');
    const state = await live(gameId, host.auth);
    expect(state.phase).toBe('REVEAL');
  });

  it('תשובה בדיוק אחרי 60 שניות נדחית', async () => {
    const { gameId, host } = await setupRunningGame([competitive('שאלה', 1)]);
    advanceMs(60_000);
    expect((await phone(SHIRA, '1')).text).toContain('הזמן לשאלה הזו הסתיים');
    const state = await live(gameId, host.auth);
    expect(state.phase).toBe('REVEAL');
    expect(state.answeredCount).toBe(0);
  });

  it('השאלה לא נסגרת מוקדם כשיש מחוברת שלא ענתה; מי שהתנתקה לא נספרת', async () => {
    const { gameId, host } = await setupRunningGame([competitive('שאלה', 1), competitive('שאלה 2', 1)]);
    advanceMs(1_000);
    await phone(SHIRA, '1');
    expect((await live(gameId, host.auth)).phase).toBe('QUESTION');

    await phone(NOA, undefined, { hangup: 'yes' });
    expect((await live(gameId, host.auth)).phase).toBe('REVEAL');
  });

  it('שוויון בנקודות — מי שענתה מהר יותר (במילישניות) מדורגת ראשונה', async () => {
    const { gameId, host } = await setupRunningGame([competitive('שאלה', 1)]);
    advanceMs(2_500);
    await phone(NOA, '1'); // 2500ms → 980
    advanceMs(300);
    await phone(SHIRA, '1'); // 2800ms → 980
    const state = await live(gameId, host.auth);
    expect(state.reveal.leaderboard.map((r: { name: string; score: number }) => [r.name, r.score])).toEqual([
      ['נועה', 980],
      ['שירה', 980],
    ]);
  });

  it('שאלת סקר: אין ניקוד, התפלגות, 5 המהירים כוללים את כל העונות', async () => {
    const { gameId, host } = await setupRunningGame([poll('סקר')]);
    advanceMs(1_200);
    expect((await phone(SHIRA, '4')).text).toContain('התשובה נקלטה');
    advanceMs(800);
    await phone(NOA, '4');
    const state = await live(gameId, host.auth);
    expect(state.phase).toBe('REVEAL');
    expect(state.reveal.correctOption).toBeNull();
    expect(state.reveal.distribution).toEqual([0, 0, 0, 2]);
    expect(state.fastest.map((f: { name: string }) => f.name)).toEqual(['שירה', 'נועה']);
    expect(state.reveal.leaderboard.every((r: { score: number }) => r.score === 0)).toBe(true);
    const answers = await prisma.answer.findMany();
    expect(answers.every((a) => a.isCorrect === null && a.points === 0)).toBe(true);
  });

  it('החשיפה מחכה למנחה: גם אחרי הרבה זמן המשחק לא עובר לשאלה הבאה לבד', async () => {
    const { gameId, host } = await setupRunningGame([competitive('שאלה א', 1), competitive('שאלה ב', 1)]);
    // בזמן שאלה פתוחה אי אפשר לדלג
    expect((await api().post(`/api/games/${gameId}/next`).set(host.auth)).status).toBe(409);
    advanceMs(10 * 60_000);
    let state = await live(gameId, host.auth);
    expect(state.phase).toBe('REVEAL');
    expect(state.questionNumber).toBe(1);
    await api().post(`/api/games/${gameId}/next`).set(host.auth);
    state = await live(gameId, host.auth);
    expect(state.phase).toBe('QUESTION');
    expect(state.questionNumber).toBe(2);
    expect(state.timeLeftMs).toBe(60_000);
  });

  it('עצירה באמצע — סיום מיידי עם סיכום', async () => {
    const { gameId, host } = await setupRunningGame();
    advanceMs(1_000);
    await phone(SHIRA, '2');
    const res = await api().post(`/api/games/${gameId}/stop`).set(host.auth);
    expect(res.status).toBe(200);
    expect(res.body.live.phase).toBe('FINISHED');
    expect(res.body.live.summary.winners[0].name).toBe('שירה');
  });

  it('20 משתתפות עונות בו-זמנית — כל התשובות נקלטות, בלי כפילויות ובלי טעויות ניקוד', async () => {
    const host = await hostWithToken();
    const participants = Array.from({ length: 20 }, (_, i) => ({ name: `משתתפת ${i + 1}`, phone: `0500000${String(200 + i)}` }));
    const { gameId } = await createFullGame(host.auth, { questions: [competitive('שאלה', 1), competitive('שאלה 2', 1)], participants });
    freezeTime();
    await api().post(`/api/games/${gameId}/lobby`).set(host.auth);
    await Promise.all(participants.map((p) => phone(p.phone)));
    await api().post(`/api/games/${gameId}/start`).set(host.auth);
    advanceMs(4_000);

    // כל אחת מקישה פעמיים במקביל — רק אחת נספרת
    const results = await Promise.all(participants.flatMap((p, i) => [phone(p.phone, i % 2 === 0 ? '1' : '2'), phone(p.phone, '1')]));
    expect(results.every((r) => r.status === 200)).toBe(true);

    expect(await prisma.answer.count()).toBe(20);
    const state = await live(gameId, host.auth);
    expect(state.phase).toBe('REVEAL');
    const scores = await prisma.participant.findMany({ where: { gameId }, select: { score: true } });
    const total = scores.reduce((s, p) => s + p.score, 0);
    const pointsSum = (await prisma.answer.aggregate({ _sum: { points: true } }))._sum.points;
    expect(total).toBe(pointsSum);
    expect(scores.every((s) => s.score === 0 || s.score === 960)).toBe(true);
  });
});
