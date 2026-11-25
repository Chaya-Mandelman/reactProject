import { afterEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '../src/db/prisma';
import { aiProvider } from '../src/modules/ai/ai.provider';
import { api, createFullGame, hostWithToken } from './helpers';

// בבדיקות אין פנייה אמיתית ל-OpenAI: מחליפים את התשובה
const mockAi = (value: unknown) => vi.spyOn(aiProvider, 'generateJson').mockResolvedValue(value);

afterEach(() => vi.restoreAllMocks());

describe('AI — יצירת שאלות', () => {
  it('בלי מפתח: הסטטוס כבוי והיצירה מחזירה 503', async () => {
    const host = await hostWithToken();
    const { gameId } = await createFullGame(host.auth);
    const status = await api().get('/api/ai/status').set(host.auth);
    expect(status.body).toEqual({ enabled: false });
    expect((await api().get('/api/ai/status')).status).toBe(401);
    const res = await api().post(`/api/games/${gameId}/ai/questions`).set(host.auth).send({ topic: 'חלל' });
    expect(res.status).toBe(503);
    expect(res.body.error.code).toBe('AI_DISABLED');
  });

  it('מחזיר טיוטות תקינות בלבד ולא שומר כלום', async () => {
    const host = await hostWithToken();
    const { gameId } = await createFullGame(host.auth);
    const spy = mockAi({
      questions: [
        { type: 'COMPETITIVE', text: 'איזה כוכב לכת הכי קרוב לשמש?', options: ['נוגה', 'כוכב חמה', 'מאדים', 'צדק'], correctOption: 2 },
        { type: 'POLL', text: 'איזה כוכב לכת הכי מעניין?', options: ['שבתאי', 'צדק', 'מאדים', 'נוגה'], correctOption: 3 },
        { type: 'COMPETITIVE', text: 'תשובות כפולות', options: ['א', 'א', 'ב', 'ג'], correctOption: 1 },
        { type: 'COMPETITIVE', text: 'רק שלוש תשובות', options: ['א', 'ב', 'ג'], correctOption: 1 },
        { type: 'COMPETITIVE', text: 'בלי תשובה נכונה', options: ['א', 'ב', 'ג', 'ד'], correctOption: null },
      ],
    });

    const res = await api()
      .post(`/api/games/${gameId}/ai/questions`)
      .set(host.auth)
      .send({ topic: 'מערכת השמש', count: 5, difficulty: 'EASY', kind: 'MIXED', notes: 'לכיתה ד' });
    expect(res.status).toBe(200);
    expect(res.body.skipped).toBe(3);
    expect(res.body.questions).toEqual([
      { type: 'COMPETITIVE', text: 'איזה כוכב לכת הכי קרוב לשמש?', option1: 'נוגה', option2: 'כוכב חמה', option3: 'מאדים', option4: 'צדק', correctOption: 2 },
      // בסקר התשובה הנכונה מתאפסת
      { type: 'POLL', text: 'איזה כוכב לכת הכי מעניין?', option1: 'שבתאי', option2: 'צדק', option3: 'מאדים', option4: 'נוגה', correctOption: null },
    ]);

    const call = spy.mock.calls[0]![0];
    expect(call.input).toContain('מערכת השמש');
    expect(call.input).toContain('לכיתה ד');
    expect(await prisma.question.count({ where: { gameId } })).toBe(2); // לא נשמר כלום

    // הטיוטות נשמרות דרך הוספה מרובה
    const saved = await api().post(`/api/games/${gameId}/questions/bulk`).set(host.auth).send({ questions: res.body.questions });
    expect(saved.status).toBe(201);
  });

  it('לא מחזיר יותר שאלות ממה שביקשו', async () => {
    const host = await hostWithToken();
    const { gameId } = await createFullGame(host.auth);
    const q = (n: number) => ({ type: 'COMPETITIVE', text: `שאלה ${n}`, options: ['א', 'ב', 'ג', 'ד'], correctOption: 1 });
    mockAi({ questions: [q(1), q(2), q(3)] });
    const res = await api().post(`/api/games/${gameId}/ai/questions`).set(host.auth).send({ topic: 'כללי', count: 2 });
    expect(res.body.questions).toHaveLength(2);
    expect(res.body.skipped).toBe(0);
  });

  it('ולידציה והרשאות', async () => {
    const host = await hostWithToken();
    const other = await hostWithToken();
    const { gameId } = await createFullGame(host.auth);
    const spy = mockAi({ questions: [] });
    const url = `/api/games/${gameId}/ai/questions`;
    expect((await api().post(url).set(host.auth).send({ topic: 'א' })).status).toBe(400);
    expect((await api().post(url).set(host.auth).send({ topic: 'חלל', count: 21 })).status).toBe(400);
    expect((await api().post(url).set(host.auth).send({ topic: 'חלל', kind: 'OTHER' })).status).toBe(400);
    expect((await api().post(url).set(other.auth).send({ topic: 'חלל' })).status).toBe(404);
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('AI — הדבקה חכמה של משתתפים', () => {
  it('מנרמל טלפונים ומסמן שורות בעייתיות, בלי לשמור', async () => {
    const host = await hostWithToken();
    const { gameId } = await createFullGame(host.auth); // 0500000101 (שירה) כבר רשומה
    const spy = mockAi({
      participants: [
        { name: 'רות כהן', phone: '050-000-0201' },
        { name: 'מיכל', phone: '+972 50 000 0202' },
        { name: 'בלי טלפון', phone: '' },
        { name: 'טלפון שבור', phone: '123' },
        { name: 'שירה שוב', phone: '0500000101' },
        { name: 'רות פעמיים', phone: '0500000201' },
        { name: '', phone: '' },
      ],
    });
    const text = 'רות כהן 050-000-0201\nמיכל +972 50 000 0202';
    const res = await api().post(`/api/games/${gameId}/ai/participants`).set(host.auth).send({ text });
    expect(res.status).toBe(200);
    expect(res.body.participants).toEqual([
      { name: 'רות כהן', phone: '0500000201', error: null },
      { name: 'מיכל', phone: '0500000202', error: null },
      { name: 'בלי טלפון', phone: '', error: 'חסר טלפון' },
      { name: 'טלפון שבור', phone: '123', error: 'טלפון לא תקין' },
      { name: 'שירה שוב', phone: '0500000101', error: 'הטלפון כבר ברשימה (שירה)' },
      { name: 'רות פעמיים', phone: '0500000201', error: 'הטלפון כבר ברשימה (רות כהן)' },
    ]);
    expect(spy.mock.calls[0]![0].input).toBe(text);
    expect(await prisma.participant.count({ where: { gameId } })).toBe(2);

    // השורות התקינות נשמרות דרך הוספה מרובה
    const ok = res.body.participants.filter((p: { error: string | null }) => p.error === null).map(({ name, phone }: { name: string; phone: string }) => ({ name, phone }));
    expect((await api().post(`/api/games/${gameId}/participants/bulk`).set(host.auth).send({ participants: ok })).status).toBe(201);
  });

  it('ולידציה והרשאות', async () => {
    const host = await hostWithToken();
    const other = await hostWithToken();
    const { gameId } = await createFullGame(host.auth);
    const spy = mockAi({ participants: [] });
    const url = `/api/games/${gameId}/ai/participants`;
    expect((await api().post(url).set(host.auth).send({ text: '' })).status).toBe(400);
    expect((await api().post(url).set(host.auth).send({ text: 'א'.repeat(20_001) })).status).toBe(400);
    expect((await api().post(url).set(other.auth).send({ text: 'רות 0500000201' })).status).toBe(404);
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('AI — הגנה על המפתח', () => {
  it('מפתח עם רווח או ירידת שורה לא נחשב תקין', async () => {
    const { isUsableKey } = await import('../src/modules/ai/ai.provider');
    expect(isUsableKey('sk-proj-abcdefgh12345678')).toBe(true);
    expect(isUsableKey(undefined)).toBe(false);
    expect(isUsableKey('')).toBe(false);
    expect(isUsableKey('sk-proj-abcdefgh12345678\nOPENAI_MODEL=gpt-4o-mini')).toBe(false);
    expect(isUsableKey('sk-proj-abc defgh')).toBe(false);
  });

  it('היומן לא כולל את המפתח', async () => {
    const { describeError, redactSecrets } = await import('../src/modules/ai/ai.provider');
    const key = 'sk-proj-SECRETsecret1234567890\nOPENAI_MODEL=gpt-4o-mini';
    const text = redactSecrets(`Headers.append: "Bearer ${key}" is an invalid header value`, key);
    expect(text).not.toContain('SECRETsecret');
    expect(text).toContain('Bearer sk-***');
    expect(describeError(new TypeError('Bearer sk-proj-OTHERkey9876543210 bad'))).toBe('TypeError: Bearer sk-*** bad');
  });
});
