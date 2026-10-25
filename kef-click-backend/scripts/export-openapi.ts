/** כותב את תיעוד ה-API לקובץ docs/openapi.json (npm run openapi) */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { openApiSpec } from '../src/docs/openapi';

const out = join(__dirname, '..', 'docs', 'openapi.json');
writeFileSync(out, `${JSON.stringify(openApiSpec, null, 2)}\n`, 'utf8');
// eslint-disable-next-line no-console
console.log(`נכתב: ${out}`);
