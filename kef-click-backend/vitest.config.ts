import { defineConfig } from 'vitest/config';
import { TEST_ENV } from './tests/testEnv';

export default defineConfig({
  test: {
    environment: 'node',
    env: TEST_ENV,
    globalSetup: ['tests/globalSetup.ts'],
    setupFiles: ['tests/setup.ts'],
    // כל הבדיקות משתמשות באותו מסד נתונים — מריצים קובץ אחרי קובץ
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
});
