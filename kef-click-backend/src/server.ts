import { createApp } from './app';
import { env } from './config/env';
import { prisma } from './db/prisma';

const app = createApp();

const server = app.listen(env.PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`✅ כיף Click פועל על פורט ${env.PORT}`);
  // eslint-disable-next-line no-console
  console.log(`   תיעוד: http://localhost:${env.PORT}/api-docs`);
});

/** כיבוי מסודר (Render שולח SIGTERM לפני הפעלה מחדש) */
async function shutdown() {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
