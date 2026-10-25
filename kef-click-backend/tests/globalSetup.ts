import { execSync } from 'node:child_process';
import { TEST_ENV } from './testEnv';

/** רץ פעם אחת לפני כל הבדיקות: בונה את מסד הנתונים של הבדיקות מאפס לפי ה-Migrations */
export default function setup() {
  execSync('npx prisma migrate reset --force --skip-seed --skip-generate', {
    stdio: 'inherit',
    env: { ...process.env, ...TEST_ENV },
  });
}
