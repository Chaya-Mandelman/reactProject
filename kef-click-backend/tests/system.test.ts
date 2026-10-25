import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { pointsForCorrect } from '../src/config/game';
import { openApiSpec } from '../src/docs/openapi';
import { cleanTts, readDigit } from '../src/modules/yemot/yemot.format';
import { normalizePhone } from '../src/utils/phone';
import { api, app } from './helpers';

describe('שרת', () => {
  it('GET /api/health — השרת ומסד הנתונים תקינים', async () => {
    const res = await api().get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok', database: 'ok' });
  });

  it('כתובת לא קיימת — 404 בפורמט אחיד', async () => {
    const res = await api().get('/api/nope');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('CORS מחזיר כותרות', async () => {
    const res = await api().options('/api/auth/login').set('Origin', 'http://localhost:5173').set('Access-Control-Request-Method', 'POST');
    expect(res.status).toBe(204);
    expect(res.headers['access-control-allow-origin']).toBeTruthy();
  });
});

describe('Swagger', () => {
  it('/api-docs נפתח', async () => {
    const res = await api().get('/api-docs/').redirects(1);
    expect(res.status).toBe(200);
    expect(res.text).toContain('swagger-ui');
  });

  it('/openapi.json תקין וכולל Bearer', async () => {
    const res = await api().get('/openapi.json');
    expect(res.status).toBe(200);
    expect(res.body.openapi).toMatch(/^3\./);
    expect(res.body.components.securitySchemes.bearerAuth).toMatchObject({ type: 'http', scheme: 'bearer' });
  });

  it('כל נתיב שקיים בשרת מתועד ב-Swagger (ולהפך)', () => {
    // אוספים את כל הנתיבים מתוך Express
    type Layer = { route?: { path: string; methods: Record<string, boolean> }; name: string; handle: { stack?: Layer[] }; regexp: RegExp };
    const routes = new Set<string>();
    const mounts: Record<string, string> = { authRouter: '/api/auth', adminRouter: '/api/admin', gamesRouter: '/api/games', yemotRouter: '/api/yemot' };
    const stack = (app as unknown as { _router: { stack: Layer[] } })._router.stack;
    for (const layer of stack) {
      if (layer.route) {
        for (const m of Object.keys(layer.route.methods)) routes.add(`${m.toUpperCase()} ${layer.route.path}`);
      } else if (layer.name === 'router' && layer.handle.stack) {
        const source = layer.regexp.source;
        const prefix = Object.values(mounts).find((p) => source.includes(p.replace(/\//g, '\\/')));
        if (!prefix) continue;
        for (const sub of layer.handle.stack) {
          if (!sub.route) continue;
          for (const m of Object.keys(sub.route.methods)) {
            const path = `${prefix}${sub.route.path === '/' ? '' : sub.route.path}`;
            routes.add(`${m.toUpperCase()} ${path}`);
          }
        }
      }
    }
    const apiRoutes = [...routes].filter((r) => r.includes(' /api/')).map((r) => r.replace(/:(\w+)/g, '{$1}'));
    const documented = Object.entries(openApiSpec.paths).flatMap(([p, ops]) => Object.keys(ops).map((m) => `${m.toUpperCase()} ${p}`));

    expect(apiRoutes.sort()).toEqual(documented.filter((d) => d.includes(' /api/')).sort());
  });

  it('docs/openapi.json מעודכן', () => {
    const file = JSON.parse(readFileSync(join(__dirname, '..', 'docs', 'openapi.json'), 'utf8'));
    expect(file).toEqual(JSON.parse(JSON.stringify(openApiSpec)));
  });
});

describe('Prisma', () => {
  it('הסכמה תקינה', () => {
    expect(() => execSync('npx prisma validate', { stdio: 'pipe', env: process.env })).not.toThrow();
  });

  it('ה-Migrations תואמות בדיוק לסכמה', () => {
    // exit code 2 = יש הבדלים, 0 = אין הבדלים
    expect(() =>
      execSync(`npx prisma migrate diff --from-url "${process.env.DATABASE_URL}" --to-schema-datamodel prisma/schema.prisma --exit-code`, {
        stdio: 'pipe',
        env: process.env,
      }),
    ).not.toThrow();
  });

  it('אילוצי תקינות במסד הנתונים חוסמים נתונים שגויים', async () => {
    const { prisma } = await import('../src/db/prisma');
    const user = await prisma.user.create({ data: { name: 'x', email: 'x@x.x', passwordHash: 'x' } });
    const game = await prisma.game.create({ data: { hostId: user.id, title: 'x' } });
    await expect(
      prisma.question.create({
        data: { gameId: game.id, order: 1, type: 'POLL', text: 'x', option1: 'a', option2: 'b', option3: 'c', option4: 'd', correctOption: 2 },
      }),
    ).rejects.toThrow();
  });
});

describe('כללים ופורמטים', () => {
  it('ניקוד לפי שניות שלמות', () => {
    expect(pointsForCorrect(0)).toBe(1000);
    expect(pointsForCorrect(999)).toBe(1000);
    expect(pointsForCorrect(1000)).toBe(990);
    expect(pointsForCorrect(3700)).toBe(970);
    expect(pointsForCorrect(30_000)).toBe(700);
    expect(pointsForCorrect(59_999)).toBe(410);
  });

  it('נרמול טלפונים', () => {
    expect(normalizePhone('050-123-4567')).toBe('0501234567');
    expect(normalizePhone('+972501234567')).toBe('0501234567');
    expect(normalizePhone('972-2-6251234')).toBe('026251234');
    expect(normalizePhone('501234567')).toBe('0501234567');
    expect(normalizePhone('123')).toBeNull();
    expect(normalizePhone('')).toBeNull();
  });

  it('ניקוי טקסט להקראה בימות המשיח', () => {
    expect(cleanTts('שלום, רחל-לאה. "בהצלחה" & = |')).toBe('שלום רחל לאה בהצלחה');
  });

  it('פקודת read בפורמט של ימות המשיח', () => {
    expect(readDigit('הקישו תשובה')).toBe('read=t-הקישו תשובה=answer,no,1,1,60,No,yes,yes,,1234,1,Ok,None,,no');
  });
});
