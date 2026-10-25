import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { corsOrigins } from './config/env';
import { prisma } from './db/prisma';
import { openApiSpec } from './docs/openapi';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { adminRouter } from './modules/admin/admin.routes';
import { authRouter } from './modules/auth/auth.routes';
import { gamesRouter } from './modules/games/games.routes';
import { yemotRouter } from './modules/yemot/yemot.routes';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1); // Render יושב מאחורי Proxy — כדי שהגבלת ניסיונות תזהה את ה-IP האמיתי

  // כותרות אבטחה בסיסיות לכל תשובה
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    next();
  });

  app.use(
    cors({
      origin: corsOrigins === '*' ? true : corsOrigins,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );
  app.use(express.json({ limit: '100kb' }));

  // ===== בדיקת בריאות =====
  app.get('/api/health', async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: 'ok', database: 'ok', time: new Date().toISOString() });
    } catch {
      res.status(503).json({ status: 'error', database: 'unreachable', time: new Date().toISOString() });
    }
  });

  // ===== תיעוד Swagger =====
  app.get('/openapi.json', (_req, res) => res.json(openApiSpec));
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
      customSiteTitle: 'כיף Click — API',
      swaggerOptions: { persistAuthorization: true },
    }),
  );
  app.get('/', (_req, res) => res.redirect('/api-docs'));

  // ===== נתיבי ה-API =====
  app.use('/api/auth', authRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/games', gamesRouter);
  app.use('/api/yemot', yemotRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
