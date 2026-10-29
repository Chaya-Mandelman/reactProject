/**
 * תיעוד OpenAPI 3 של כל ה-API.
 * מוצג ב-/api-docs (Swagger UI) וזמין כקובץ ב-/openapi.json
 */

const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const json = (schema: unknown, example?: unknown) => ({
  'application/json': { schema, ...(example !== undefined ? { example } : {}) },
});

/** תשובות שגיאה נפוצות */
const errors: Record<string, { description: string; content: ReturnType<typeof json> }> = {
  400: { description: 'קלט לא תקין', content: json(ref('Error'), { error: { code: 'BAD_REQUEST', message: 'הנתונים שנשלחו אינם תקינים', details: [{ field: 'title', message: 'שם המשחק קצר מדי' }] } }) },
  401: { description: 'חסר Token או Token לא תקין / פג תוקף', content: json(ref('Error'), { error: { code: 'UNAUTHORIZED', message: 'חסר Token. יש לשלוח Authorization: Bearer <token>' } }) },
  403: { description: 'אין הרשאה לפעולה (תפקיד לא מתאים או חשבון חסום)', content: json(ref('Error'), { error: { code: 'FORBIDDEN', message: 'אין לך הרשאה לפעולה זו' } }) },
  404: { description: 'לא נמצא (או שייך למשתמש אחר)', content: json(ref('Error'), { error: { code: 'NOT_FOUND', message: 'המשחק לא נמצא' } }) },
  409: { description: 'התנגשות — הפעולה לא מתאימה למצב הנוכחי', content: json(ref('Error'), { error: { code: 'CONFLICT', message: 'אי אפשר לערוך משחק בזמן לובי או משחק פעיל. יש לסיים אותו קודם (stop)' } }) },
};
const pick = (...codes: number[]) => Object.fromEntries(codes.map((c) => [String(c), errors[c]]));

const bearer = [{ bearerAuth: [] }];
const gameId = { name: 'id', in: 'path', required: true, description: 'מזהה המשחק', schema: { type: 'integer', example: 1 } };
const pid = { name: 'pid', in: 'path', required: true, description: 'מזהה המשתתף', schema: { type: 'integer', example: 1 } };
const qid = { name: 'qid', in: 'path', required: true, description: 'מזהה השאלה', schema: { type: 'integer', example: 1 } };

const exampleUser = { id: 2, name: 'רחל לוי', email: 'rachel.levi@kefclick.local', role: 'HOST', isBlocked: false, createdAt: '2026-10-23T08:00:00.000Z' };
const exampleQuestion = { id: 1, order: 1, type: 'COMPETITIVE', text: 'מהי עיר הבירה של ישראל?', option1: 'תל אביב', option2: 'ירושלים', option3: 'חיפה', option4: 'באר שבע', correctOption: 2 };
const exampleGame = {
  id: 1,
  title: 'חידון גיאוגרפיה — כיתה ו׳1',
  description: 'חזרה לקראת המבחן',
  status: 'SETUP',
  host: { id: 2, name: 'רחל לוי' },
  createdAt: '2026-10-23T08:00:00.000Z',
  updatedAt: '2026-10-23T08:00:00.000Z',
  questions: [exampleQuestion],
  participants: [{ id: 1, name: 'שירה כהן', phone: '0500000101' }],
};

/** פעולת שליטה במשחק (לובי/התחלה/השהיה/המשך/עצירה) */
const controlOp = (summary: string, description: string) => ({
  tags: ['הרצת משחק'],
  summary,
  description,
  security: bearer,
  parameters: [gameId],
  responses: {
    200: { description: 'הצלחה — מוחזר המצב החי המעודכן', content: json({ type: 'object', properties: { live: ref('LiveState') } }) },
    ...pick(401, 403, 404, 409),
  },
});

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'כיף Click — API',
    version: '1.0.0',
    description: [
      'שרת למשחק חידונים תחרותי שעונים עליו בטלפון דרך ימות המשיח.',
      '',
      '**איך מתחברים מתוך Swagger:**',
      '1. פותחים `POST /api/auth/login` ← Try it out ← Execute.',
      '2. מעתיקים את הערך של `token` מהתשובה.',
      '3. לוחצים על הכפתור **Authorize** למעלה, מדביקים את ה-token (בלי המילה Bearer) ← Authorize.',
      '4. עכשיו אפשר לקרוא לכל נתיב מוגן.',
      '',
      '**כללי המשחק:** 60 שניות לשאלה (נסגרת מוקדם אם כל המחוברים ענו), 5 שניות חשיפה, מעבר אוטומטי.',
      'ניקוד בשאלה תחרותית: 1000 נקודות, פחות 10 על כל שנייה שלמה (שנייה 59 = 410). תשובה שגויה / סקר = 0.',
    ].join('\n'),
  },
  servers: [{ url: '/', description: 'השרת הנוכחי' }],
  tags: [
    { name: 'מערכת', description: 'בדיקת בריאות' },
    { name: 'התחברות', description: 'הרשמה, התחברות ופרטי המשתמש המחובר' },
    { name: 'ניהול (מנהל)', description: 'למנהל מערכת בלבד' },
    { name: 'משחקים', description: 'ניהול משחקים של המנחה' },
    { name: 'משתתפים', description: 'משתתפים במשחק (שם וטלפון)' },
    { name: 'שאלות', description: 'שאלות המשחק' },
    { name: 'הרצת משחק', description: 'לובי, התחלה, השהיה, המשך, עצירה ומצב חי' },
    { name: 'ימות המשיח', description: 'הכתובת שימות המשיח פונה אליה' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'הדביקי כאן את ה-token שקיבלת מ-login' },
    },
    schemas: {
      Error: {
        type: 'object',
        required: ['error'],
        properties: {
          error: {
            type: 'object',
            required: ['code', 'message'],
            properties: {
              code: { type: 'string', example: 'BAD_REQUEST' },
              message: { type: 'string', example: 'הנתונים שנשלחו אינם תקינים' },
              details: { description: 'פירוט נוסף (למשל שגיאה לכל שדה)' },
            },
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['ADMIN', 'HOST'] },
          isBlocked: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
        example: exampleUser,
      },
      Host: {
        allOf: [ref('User'), { type: 'object', properties: { gamesCount: { type: 'integer', example: 3 } } }],
      },
      AuthResponse: {
        type: 'object',
        properties: { token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }, user: ref('User') },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: { email: { type: 'string', format: 'email' }, password: { type: 'string' } },
        example: { email: 'rachel.levi@kefclick.local', password: 'Host1234!' },
      },
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 80 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8, description: 'לפחות 8 תווים, אות באנגלית וספרה' },
        },
        example: { name: 'מרים אדלר', email: 'miriam@example.com', password: 'Secret123' },
      },
      CreateHostInput: { $ref: '#/components/schemas/RegisterInput' },
      UpdateHostInput: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
          isBlocked: { type: 'boolean', description: 'true = חסימה, false = שחרור' },
        },
        example: { isBlocked: true },
      },
      GameSummary: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          status: { type: 'string', enum: ['SETUP', 'LOBBY', 'RUNNING', 'PAUSED', 'FINISHED'] },
          host: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' } } },
          questionsCount: { type: 'integer' },
          participantsCount: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        example: { id: 1, title: 'חידון גיאוגרפיה — כיתה ו׳1', description: null, status: 'SETUP', host: { id: 2, name: 'רחל לוי' }, questionsCount: 8, participantsCount: 25, createdAt: '2026-10-23T08:00:00.000Z', updatedAt: '2026-10-23T08:00:00.000Z' },
      },
      GameDetails: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          status: { type: 'string', enum: ['SETUP', 'LOBBY', 'RUNNING', 'PAUSED', 'FINISHED'] },
          host: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' } } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          questions: { type: 'array', items: ref('Question') },
          participants: { type: 'array', items: ref('Participant') },
        },
        example: exampleGame,
      },
      GameInput: {
        type: 'object',
        required: ['title'],
        properties: { title: { type: 'string', minLength: 2, maxLength: 100 }, description: { type: 'string', maxLength: 500, nullable: true } },
        example: { title: 'חידון חנוכה', description: 'לכיתה ה׳2' },
      },
      Participant: {
        type: 'object',
        properties: { id: { type: 'integer' }, name: { type: 'string' }, phone: { type: 'string', description: 'ספרות בלבד, מתחיל ב-0' } },
        example: { id: 1, name: 'שירה כהן', phone: '0500000101' },
      },
      ParticipantInput: {
        type: 'object',
        required: ['name', 'phone'],
        properties: { name: { type: 'string', minLength: 2, maxLength: 60 }, phone: { type: 'string', description: 'אפשר עם מקפים או ‎+972 — השרת ממיר לפורמט אחיד' } },
        example: { name: 'שירה כהן', phone: '050-000-0101' },
      },
      Question: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          order: { type: 'integer' },
          type: { type: 'string', enum: ['COMPETITIVE', 'POLL'] },
          text: { type: 'string' },
          option1: { type: 'string' },
          option2: { type: 'string' },
          option3: { type: 'string' },
          option4: { type: 'string' },
          correctOption: { type: 'integer', minimum: 1, maximum: 4, nullable: true, description: 'ריק בסקר' },
        },
        example: exampleQuestion,
      },
      QuestionInput: {
        type: 'object',
        required: ['text', 'option1', 'option2', 'option3', 'option4'],
        properties: {
          type: { type: 'string', enum: ['COMPETITIVE', 'POLL'], default: 'COMPETITIVE' },
          text: { type: 'string', minLength: 2, maxLength: 300 },
          option1: { type: 'string', maxLength: 120 },
          option2: { type: 'string', maxLength: 120 },
          option3: { type: 'string', maxLength: 120 },
          option4: { type: 'string', maxLength: 120 },
          correctOption: { type: 'integer', minimum: 1, maximum: 4, nullable: true, description: 'חובה בתחרותית, אסור בסקר' },
        },
        example: { type: 'COMPETITIVE', text: 'כמה ימים יש בשבוע?', option1: '5', option2: '6', option3: '7', option4: '8', correctOption: 3 },
      },
      LeaderboardRow: {
        type: 'object',
        properties: {
          rank: { type: 'integer' },
          participantId: { type: 'integer' },
          name: { type: 'string' },
          score: { type: 'integer' },
          correctCount: { type: 'integer' },
          totalCorrectMs: { type: 'integer', description: 'סכום זמני התשובות הנכונות — שובר שוויון' },
        },
        example: { rank: 1, participantId: 4, name: 'נועה פרידמן', score: 2930, correctCount: 3, totalCorrectMs: 9412 },
      },
      LiveState: {
        type: 'object',
        description: 'המצב החי של המשחק. השדות משתנים לפי phase.',
        properties: {
          serverTime: { type: 'string', format: 'date-time' },
          game: { type: 'object', properties: { id: { type: 'integer' }, title: { type: 'string' }, status: { type: 'string' } } },
          totalQuestions: { type: 'integer' },
          participants: { type: 'array', items: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' }, connected: { type: 'boolean' } } } },
          connectedCount: { type: 'integer' },
          phase: { type: 'string', enum: ['SETUP', 'LOBBY', 'QUESTION', 'REVEAL', 'FINISHED'] },
          paused: { type: 'boolean', description: 'רק בזמן שאלה/חשיפה' },
          questionNumber: { type: 'integer' },
          question: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              type: { type: 'string', enum: ['COMPETITIVE', 'POLL'] },
              text: { type: 'string' },
              options: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4 },
              correctOption: { type: 'integer', nullable: true, description: 'מוצג רק בחשיפה' },
            },
          },
          timeLeftMs: { type: 'integer' },
          isLastQuestion: { type: 'boolean' },
          answeredCount: { type: 'integer' },
          lastAnswerId: { type: 'integer', nullable: true, description: 'לשלוח כ-afterAnswerId ברענון הבא' },
          recentAnswers: {
            type: 'array',
            description: 'תשובות חדשות — להקפצת השם בתחתית המסך',
            items: { type: 'object', properties: { answerId: { type: 'integer' }, participantId: { type: 'integer' }, name: { type: 'string' }, receivedAt: { type: 'string', format: 'date-time' } } },
          },
          fastest: {
            type: 'array',
            description: '5 המהירים (בתחרותית — רק נכונים)',
            items: { type: 'object', properties: { participantId: { type: 'integer' }, name: { type: 'string' }, responseMs: { type: 'integer' } } },
          },
          reveal: {
            type: 'object',
            description: 'רק בשלב REVEAL',
            properties: {
              correctOption: { type: 'integer', nullable: true },
              distribution: { type: 'array', items: { type: 'integer' }, description: 'כמה בחרו בכל תשובה [1,2,3,4]' },
              leaderboard: { type: 'array', items: ref('LeaderboardRow') },
            },
          },
          summary: {
            type: 'object',
            description: 'רק בשלב FINISHED',
            properties: { winners: { type: 'array', items: ref('LeaderboardRow') }, leaderboard: { type: 'array', items: ref('LeaderboardRow') } },
          },
        },
        example: {
          serverTime: '2026-10-23T09:00:12.000Z',
          game: { id: 1, title: 'חידון גיאוגרפיה — כיתה ו׳1', status: 'RUNNING' },
          totalQuestions: 8,
          participants: [{ id: 1, name: 'שירה כהן', connected: true }],
          connectedCount: 1,
          phase: 'QUESTION',
          paused: false,
          questionNumber: 1,
          question: { id: 1, type: 'COMPETITIVE', text: 'מהי עיר הבירה של ישראל?', options: ['תל אביב', 'ירושלים', 'חיפה', 'באר שבע'] },
          timeLeftMs: 48000,
          isLastQuestion: false,
          answeredCount: 1,
          lastAnswerId: 17,
          recentAnswers: [{ answerId: 17, participantId: 1, name: 'שירה כהן', receivedAt: '2026-10-23T09:00:03.200Z' }],
          fastest: [{ participantId: 1, name: 'שירה כהן', responseMs: 3200 }],
        },
      },
    },
  },
  paths: {
    '/api/health': {
      get: {
        tags: ['מערכת'],
        summary: 'בדיקת בריאות השרת ומסד הנתונים',
        responses: {
          200: { description: 'השרת ומסד הנתונים תקינים', content: json({ type: 'object' }, { status: 'ok', database: 'ok', time: '2026-10-23T09:00:00.000Z' }) },
          503: { description: 'אין חיבור למסד הנתונים', content: json({ type: 'object' }, { status: 'error', database: 'unreachable' }) },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['התחברות'],
        summary: 'הרשמה עצמית כמנחה',
        description: 'יוצר חשבון מנחה (HOST) ומחזיר Token — המנחה מחובר מיד. אי אפשר להירשם כמנהל.',
        requestBody: { required: true, content: json(ref('RegisterInput')) },
        responses: { 201: { description: 'נרשם בהצלחה', content: json(ref('AuthResponse')) }, ...pick(400, 409) },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['התחברות'],
        summary: 'התחברות — מחזיר JWT',
        requestBody: { required: true, content: json(ref('LoginInput')) },
        responses: {
          200: { description: 'התחברות הצליחה', content: json(ref('AuthResponse')) },
          400: errors[400],
          401: { description: 'אימייל או סיסמה שגויים', content: json(ref('Error'), { error: { code: 'UNAUTHORIZED', message: 'אימייל או סיסמה שגויים' } }) },
          403: { description: 'החשבון חסום', content: json(ref('Error'), { error: { code: 'FORBIDDEN', message: 'החשבון חסום. פני למנהל המערכת' } }) },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['התחברות'],
        summary: 'פרטי המשתמש המחובר',
        security: bearer,
        responses: { 200: { description: 'המשתמש המחובר', content: json({ type: 'object', properties: { user: ref('User') } }) }, ...pick(401, 403) },
      },
    },
    '/api/admin/hosts': {
      get: {
        tags: ['ניהול (מנהל)'],
        summary: 'רשימת מנחים',
        security: bearer,
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'חיפוש לפי שם או אימייל' },
          { name: 'blocked', in: 'query', schema: { type: 'string', enum: ['true', 'false'] }, description: 'סינון חסומים / פעילים' },
        ],
        responses: { 200: { description: 'רשימה', content: json({ type: 'object', properties: { hosts: { type: 'array', items: ref('Host') } } }) }, ...pick(400, 401, 403) },
      },
      post: {
        tags: ['ניהול (מנהל)'],
        summary: 'יצירת מנחה',
        security: bearer,
        requestBody: { required: true, content: json(ref('CreateHostInput')) },
        responses: { 201: { description: 'נוצר', content: json({ type: 'object', properties: { host: ref('User') } }) }, ...pick(400, 401, 403, 409) },
      },
    },
    '/api/admin/hosts/{id}': {
      patch: {
        tags: ['ניהול (מנהל)'],
        summary: 'עריכת מנחה / חסימה / שחרור',
        security: bearer,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: json(ref('UpdateHostInput')) },
        responses: { 200: { description: 'עודכן', content: json({ type: 'object', properties: { host: ref('User') } }) }, ...pick(400, 401, 403, 404, 409) },
      },
    },
    '/api/admin/games': {
      get: {
        tags: ['ניהול (מנהל)'],
        summary: 'כל המשחקים במערכת',
        security: bearer,
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'חיפוש לפי שם משחק' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['SETUP', 'LOBBY', 'RUNNING', 'PAUSED', 'FINISHED'] } },
          { name: 'hostId', in: 'query', schema: { type: 'integer' }, description: 'רק משחקים של מנחה מסוים' },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['newest', 'oldest', 'title'], default: 'newest' } },
        ],
        responses: { 200: { description: 'רשימה', content: json({ type: 'object', properties: { games: { type: 'array', items: ref('GameSummary') } } }) }, ...pick(400, 401, 403) },
      },
    },
    '/api/games': {
      get: {
        tags: ['משחקים'],
        summary: 'המשחקים שלי (מנחה)',
        security: bearer,
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'חיפוש לפי שם משחק' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['SETUP', 'LOBBY', 'RUNNING', 'PAUSED', 'FINISHED'] } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['newest', 'oldest', 'title'], default: 'newest' } },
        ],
        responses: { 200: { description: 'רשימה', content: json({ type: 'object', properties: { games: { type: 'array', items: ref('GameSummary') } } }) }, ...pick(400, 401, 403) },
      },
      post: {
        tags: ['משחקים'],
        summary: 'יצירת משחק',
        security: bearer,
        requestBody: { required: true, content: json(ref('GameInput')) },
        responses: { 201: { description: 'נוצר', content: json({ type: 'object', properties: { game: ref('GameDetails') } }) }, ...pick(400, 401, 403) },
      },
    },
    '/api/games/{id}': {
      get: {
        tags: ['משחקים'],
        summary: 'משחק מלא עם שאלות ומשתתפים',
        description: 'מנחה — רק משחק שלו. מנהל — כל משחק.',
        security: bearer,
        parameters: [gameId],
        responses: { 200: { description: 'המשחק', content: json({ type: 'object', properties: { game: ref('GameDetails') } }) }, ...pick(401, 403, 404) },
      },
      patch: {
        tags: ['משחקים'],
        summary: 'עריכת שם ותיאור',
        description: 'רק כשהמשחק בסטטוס SETUP או FINISHED.',
        security: bearer,
        parameters: [gameId],
        requestBody: { required: true, content: json(ref('GameInput')) },
        responses: { 200: { description: 'עודכן', content: json({ type: 'object', properties: { game: ref('GameDetails') } }) }, ...pick(400, 401, 403, 404, 409) },
      },
      delete: {
        tags: ['משחקים'],
        summary: 'מחיקת משחק',
        description: 'מנחה — רק משחק שלו ולא פעיל. מנהל — כל משחק.',
        security: bearer,
        parameters: [gameId],
        responses: { 204: { description: 'נמחק' }, ...pick(401, 403, 404, 409) },
      },
    },
    '/api/games/{id}/duplicate': {
      post: {
        tags: ['משחקים'],
        summary: 'שכפול משחק (אותן שאלות ומשתתפים)',
        security: bearer,
        parameters: [gameId],
        responses: { 201: { description: 'העותק', content: json({ type: 'object', properties: { game: ref('GameDetails') } }) }, ...pick(401, 403, 404) },
      },
    },
    '/api/games/{id}/participants': {
      post: {
        tags: ['משתתפים'],
        summary: 'הוספת משתתף',
        security: bearer,
        parameters: [gameId],
        requestBody: { required: true, content: json(ref('ParticipantInput')) },
        responses: { 201: { description: 'נוסף', content: json({ type: 'object', properties: { participant: ref('Participant') } }) }, ...pick(400, 401, 403, 404, 409) },
      },
    },
    '/api/games/{id}/participants/{pid}': {
      patch: {
        tags: ['משתתפים'],
        summary: 'עריכת משתתף',
        security: bearer,
        parameters: [gameId, pid],
        requestBody: { required: true, content: json(ref('ParticipantInput')) },
        responses: { 200: { description: 'עודכן', content: json({ type: 'object', properties: { participant: ref('Participant') } }) }, ...pick(400, 401, 403, 404, 409) },
      },
      delete: {
        tags: ['משתתפים'],
        summary: 'מחיקת משתתף',
        security: bearer,
        parameters: [gameId, pid],
        responses: { 204: { description: 'נמחק' }, ...pick(401, 403, 404, 409) },
      },
    },
    '/api/games/{id}/questions': {
      post: {
        tags: ['שאלות'],
        summary: 'הוספת שאלה (נוספת בסוף)',
        security: bearer,
        parameters: [gameId],
        requestBody: { required: true, content: json(ref('QuestionInput')) },
        responses: { 201: { description: 'נוספה', content: json({ type: 'object', properties: { question: ref('Question') } }) }, ...pick(400, 401, 403, 404, 409) },
      },
    },
    '/api/games/{id}/questions/order': {
      put: {
        tags: ['שאלות'],
        summary: 'שינוי סדר השאלות',
        description: 'שולחים את כל מזהי השאלות בסדר החדש.',
        security: bearer,
        parameters: [gameId],
        requestBody: {
          required: true,
          content: json({ type: 'object', required: ['questionIds'], properties: { questionIds: { type: 'array', items: { type: 'integer' } } } }, { questionIds: [3, 1, 2] }),
        },
        responses: { 200: { description: 'הסדר החדש', content: json({ type: 'object', properties: { questions: { type: 'array', items: ref('Question') } } }) }, ...pick(400, 401, 403, 404, 409) },
      },
    },
    '/api/games/{id}/questions/{qid}': {
      patch: {
        tags: ['שאלות'],
        summary: 'עריכת שאלה',
        description: 'אפשר לשלוח רק את השדות שמשתנים. מעבר לסקר מנקה את התשובה הנכונה.',
        security: bearer,
        parameters: [gameId, qid],
        requestBody: { required: true, content: json(ref('QuestionInput')) },
        responses: { 200: { description: 'עודכנה', content: json({ type: 'object', properties: { question: ref('Question') } }) }, ...pick(400, 401, 403, 404, 409) },
      },
      delete: {
        tags: ['שאלות'],
        summary: 'מחיקת שאלה',
        security: bearer,
        parameters: [gameId, qid],
        responses: { 204: { description: 'נמחקה' }, ...pick(401, 403, 404, 409) },
      },
    },
    '/api/games/{id}/lobby': { post: controlOp('פתיחת לובי', 'מאפס תשובות וניקוד מהסבב הקודם. דורש לפחות שאלה ומשתתף. נכשל (409) אם טלפון כבר רשום במשחק פעיל אחר.') },
    '/api/games/{id}/start': { post: controlOp('התחלת המשחק', 'רק מהלובי. שאלה 1 נפתחת מיד.') },
    '/api/games/{id}/pause': { post: controlOp('השהיה', 'הטיימר נעצר ותשובות לא נקלטות.') },
    '/api/games/{id}/resume': { post: controlOp('המשך', 'הטיימר ממשיך מאותה נקודה.') },
    '/api/games/{id}/next': { post: controlOp('לשאלה הבאה', 'רק בזמן חשיפה. אחרי השאלה האחרונה — סיום המשחק עם סיכום.') },
    '/api/games/{id}/stop': { post: controlOp('עצירה', 'מהלובי — חזרה להכנה. ממשחק רץ או מושהה — סיום מיידי עם סיכום.') },
    '/api/games/{id}/live': {
      get: {
        tags: ['הרצת משחק'],
        summary: 'מצב חי למסך (לקרוא כל שנייה)',
        description: 'מקדם את המשחק לפי השעון ומחזיר את כל מה שהמסך צריך. שלחי afterAnswerId=lastAnswerId מהקריאה הקודמת כדי לקבל ב-recentAnswers רק תשובות חדשות.',
        security: bearer,
        parameters: [gameId, { name: 'afterAnswerId', in: 'query', schema: { type: 'integer' }, description: 'להחזיר רק תשובות שהמזהה שלהן גדול מזה' }],
        responses: { 200: { description: 'מצב חי', content: json({ type: 'object', properties: { live: ref('LiveState') } }) }, ...pick(400, 401, 403, 404) },
      },
    },
    '/api/yemot/call': {
      get: {
        tags: ['ימות המשיח'],
        summary: 'כתובת ה-API של ימות המשיח (וגם לסימולציה)',
        description: [
          'ימות המשיח פונה לכאן בכל שלב בשיחה ומקבל בחזרה טקסט עם פקודות (לא JSON).',
          '',
          '**סימולציה מתוך Swagger:** הכניסי key (הערך של YEMOT_SECRET), ApiPhone של משתתף,',
          'ובפעם השנייה גם answer (1 עד 4) — כמו שמשתתף מקיש בטלפון.',
        ].join('\n'),
        parameters: [
          { name: 'key', in: 'query', required: true, schema: { type: 'string' }, description: 'המפתח הסודי (YEMOT_SECRET)' },
          { name: 'ApiPhone', in: 'query', required: true, schema: { type: 'string', example: '0500000101' }, description: 'הטלפון של המתקשר' },
          { name: 'ApiCallId', in: 'query', schema: { type: 'string' }, description: 'מזהה שיחה (ימות המשיח שולח לבד)' },
          { name: 'answer', in: 'query', schema: { type: 'string', example: '2' }, description: 'המקש שהוקש (1 עד 4), או None' },
          { name: 'hangup', in: 'query', schema: { type: 'string', enum: ['yes'] }, description: 'yes = השיחה נותקה' },
        ],
        responses: {
          200: { description: 'פקודות לימות המשיח', content: { 'text/plain': { schema: { type: 'string' }, example: 'id_list_message=t-תשובה נכונה 970 נקודות&read=t-ממתינים לשאלה הבאה=answer,no,1,1,60,No,yes,yes,,1234,1,Ok,None,,no' } } },
          403: { description: 'מפתח שגוי', content: { 'text/plain': { schema: { type: 'string' }, example: 'forbidden' } } },
        },
      },
      post: {
        tags: ['ימות המשיח'],
        summary: 'אותו דבר ב-POST (כשמוגדר api_url_post=yes)',
        requestBody: {
          content: {
            'application/x-www-form-urlencoded': {
              schema: { type: 'object', properties: { key: { type: 'string' }, ApiPhone: { type: 'string' }, answer: { type: 'string' }, hangup: { type: 'string' } } },
            },
          },
        },
        responses: { 200: { description: 'פקודות לימות המשיח', content: { 'text/plain': { schema: { type: 'string' } } } }, 403: { description: 'מפתח שגוי' } },
      },
    },
  },
};
