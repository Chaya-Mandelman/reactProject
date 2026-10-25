/**
 * נתוני הדגמה לכיף Click — בית ספר יסודי לבנות (מומצא).
 *
 * כל השמות מומצאים. מספרי הטלפון בטווח 050-0000-XXX — לא שייכים לאנשים אמיתיים.
 * לפני משחק אמיתי יש להחליף אותם במספרים האמיתיים של המשתתפות.
 *
 * הרצה: npm run db:seed
 * בטוח להריץ שוב — לא יוצר כפילויות.
 */
import 'dotenv/config';
import { PrismaClient, type QuestionType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { pointsForCorrect } from '../src/config/game';

const prisma = new PrismaClient();
const isProd = process.env.NODE_ENV === 'production';

type Q = { type?: QuestionType; text: string; options: [string, string, string, string]; correct?: 1 | 2 | 3 | 4 };

// ===================== כיתות ותלמידות =====================
const CLASSES: Record<string, { names: string[]; phonePrefix: string }> = {
  'ו׳1': {
    phonePrefix: '0500000',
    names: [
      'שירה כהן', 'נועה פרידמן', 'מיכל לוי', 'אילה רוזנברג', 'תמר שפירא', 'הדס ברגר', 'רות קליין',
      'אביגיל וייס', 'מרים גרינברג', 'יעל אשכנזי', 'חנה מזרחי', 'שרה ביטון', 'רבקה פרץ', 'לאה אברהם',
      'אסתר דהן', 'דבורה חדד', 'נחמה עזרא', 'בתיה סגל', 'צביה הורוביץ', 'אפרת גולן',
    ],
  },
  'ה׳2': {
    phonePrefix: '0500001',
    names: [
      'טליה רבינוביץ', 'אורה שלום', 'מלכה ברק', 'פנינה אלון', 'יהודית קפלן', 'חיה זילבר', 'שולמית נגר',
      'רחלי טל', 'גילה יוסף', 'נעמי בן דוד', 'אודליה כץ', 'הודיה אוחיון', 'ציפורה לנדאו', 'שלומית בירנבאום',
      'אלישבע מור', 'רעות שטיין', 'מוריה פישר', 'עדינה רוט',
    ],
  },
  'ד׳3': {
    phonePrefix: '0500002',
    names: [
      'שושנה גבאי', 'אהובה ששון', 'זהבה עמר', 'יוכבד ליבוביץ', 'נאוה אדרי', 'פרידה וקנין', 'מאיה שוורץ',
      'הילה ברנר', 'רינה אוחנה', 'דינה הלפרין', 'ליאת חזן', 'שני אלמוג', 'גאולה מלכה', 'ברכה שמעוני',
      'יפית סויסה', 'נגה פרלמן', 'תהילה בוזגלו', 'אסנת קורן', 'חגית רביבו', 'אורית לב',
    ],
  },
};

function classParticipants(className: string) {
  const cls = CLASSES[className];
  if (!cls) throw new Error(`כיתה לא קיימת: ${className}`);
  return cls.names.map((name, i) => ({ name, phone: `${cls.phonePrefix}${String(i + 1).padStart(3, '0')}` }));
}

// ===================== שאלות (כל העובדות נבדקו) =====================
const GEOGRAPHY: Q[] = [
  { text: 'מהי עיר הבירה של ישראל?', options: ['תל אביב', 'ירושלים', 'חיפה', 'באר שבע'], correct: 2 },
  { text: 'מהו המקום הנמוך ביותר על פני כדור הארץ?', options: ['הכנרת', 'מפרץ אילת', 'ים המלח', 'עמק יזרעאל'], correct: 3 },
  { text: 'איזה נהר זורם לכנרת ויוצא ממנה?', options: ['הירקון', 'הקישון', 'הירדן', 'נחל שורק'], correct: 3 },
  { text: 'הכנרת היא:', options: ['ים מלוח', 'אגם מים מתוקים', 'נהר', 'מפרץ'], correct: 2 },
  { text: 'לחוף איזה ים נמצאת העיר אילת?', options: ['הים התיכון', 'ים המלח', 'ים סוף', 'הים השחור'], correct: 3 },
  { text: 'איזו עיר נמל גדולה נמצאת למרגלות הכרמל?', options: ['אשדוד', 'חיפה', 'נתניה', 'עכו'], correct: 2 },
  { text: 'מהו ההר הגבוה ביותר בגליל?', options: ['הר תבור', 'הר הכרמל', 'הר מירון', 'הר גלבוע'], correct: 3 },
  { type: 'POLL', text: 'איזה אזור בארץ הכי יפה בעיניכן?', options: ['הגליל', 'הנגב', 'ירושלים', 'חוף הים'] },
];

const SOLAR_SYSTEM: Q[] = [
  { text: 'איזה כוכב לכת הכי קרוב לשמש?', options: ['נוגה', 'כוכב חמה', 'מאדים', 'כדור הארץ'], correct: 2 },
  { text: 'מהו כוכב הלכת הגדול ביותר במערכת השמש?', options: ['שבתאי', 'נפטון', 'צדק', 'אורנוס'], correct: 3 },
  { text: 'כמה כוכבי לכת יש במערכת השמש?', options: ['7', '8', '9', '10'], correct: 2 },
  { text: 'איזה כוכב לכת מכונה "כוכב הלכת האדום"?', options: ['מאדים', 'צדק', 'נוגה', 'שבתאי'], correct: 1 },
  { text: 'סביב מה מקיף הירח?', options: ['השמש', 'מאדים', 'כדור הארץ', 'צדק'], correct: 3 },
  { type: 'POLL', text: 'איזה כוכב לכת הייתן רוצות לחקור?', options: ['מאדים', 'צדק', 'שבתאי', 'נוגה'] },
];

const BERESHIT: Q[] = [
  { text: 'מה נברא ביום הראשון?', options: ['האור', 'הים', 'הצמחים', 'בעלי החיים'], correct: 1 },
  { text: 'איך נקראו שני הבנים הראשונים של אדם וחוה?', options: ['שם וחם', 'קין והבל', 'יצחק וישמעאל', 'יעקב ועשו'], correct: 2 },
  { text: 'כמה יום ירד הגשם במבול?', options: ['7', '12', '40', '150'], correct: 3 },
  { text: 'מה היה סימן הברית אחרי המבול?', options: ['הקשת', 'היונה', 'עלה הזית', 'התיבה'], correct: 1 },
  { text: 'מאיזו עיר יצא אברהם עם משפחתו?', options: ['חרן', 'אור כשדים', 'סדום', 'חברון'], correct: 2 },
  { text: 'מה שם הבן שנולד לאברהם ושרה?', options: ['ישמעאל', 'יעקב', 'יצחק', 'יוסף'], correct: 3 },
  { text: 'על מה חלם יעקב בדרכו לחרן?', options: ['שבע פרות', 'סולם', 'אלומות', 'כוכבים'], correct: 2 },
  { text: 'כמה בנים היו ליעקב?', options: ['10', '11', '12', '13'], correct: 3 },
];

const PARTY_POLL: Q[] = [
  { type: 'POLL', text: 'מה הנושא למסיבת סוף השנה?', options: ['ארץ ישראל', 'עונות השנה', 'מסע בזמן', 'עולם הספרים'] },
  { type: 'POLL', text: 'מתי לערוך את המסיבה?', options: ['בבוקר', 'בצהריים', 'אחר הצהריים', 'בערב'] },
  { type: 'POLL', text: 'מה הכיבוד המועדף?', options: ['פיצה', 'פלאפל', 'סלטים וכריכים', 'עוגות'] },
];

const TIMES_TABLE: Q[] = [
  { text: 'כמה זה 7 כפול 8?', options: ['54', '56', '63', '48'], correct: 2 },
  { text: 'כמה זה 6 כפול 7?', options: ['42', '36', '48', '49'], correct: 1 },
  { text: 'כמה זה 9 כפול 9?', options: ['72', '99', '81', '90'], correct: 3 },
  { text: 'כמה זה 8 כפול 6?', options: ['42', '54', '46', '48'], correct: 4 },
  { text: 'כמה זה 9 כפול 7?', options: ['63', '56', '72', '67'], correct: 1 },
  { text: 'כמה זה 4 כפול 8?', options: ['28', '36', '32', '24'], correct: 3 },
  { text: 'כמה זה 6 כפול 6?', options: ['32', '36', '42', '30'], correct: 2 },
  { text: 'כמה זה 7 כפול 7?', options: ['42', '56', '47', '49'], correct: 4 },
  { text: 'כמה זה 3 כפול 9?', options: ['27', '24', '21', '18'], correct: 1 },
  { text: 'כמה זה 10 כפול 10?', options: ['10', '1000', '100', '110'], correct: 3 },
];

const TISHREI: Q[] = [
  { text: 'באיזה תאריך חל ראש השנה?', options: ['א׳ בתשרי', 'י׳ בתשרי', 'ט״ו בתשרי', 'א׳ בניסן'], correct: 1 },
  { text: 'באיזה תאריך חל יום כיפור?', options: ['א׳ בתשרי', 'ה׳ בתשרי', 'י׳ בתשרי', 'ט״ו בתשרי'], correct: 3 },
  { text: 'באיזה תאריך מתחיל חג הסוכות?', options: ['י׳ בתשרי', 'ט״ו בתשרי', 'כ״ב בתשרי', 'כ״ה בכסלו'], correct: 2 },
  { text: 'מה מהבאים אינו מארבעת המינים?', options: ['אתרוג', 'הדס', 'רימון', 'ערבה'], correct: 3 },
  { type: 'POLL', text: 'איזה חג בתשרי אתן הכי אוהבות?', options: ['ראש השנה', 'סוכות', 'שמחת תורה', 'כולם'] },
];

function questionRows(qs: Q[]) {
  return qs.map((q, i) => ({
    order: i + 1,
    type: q.type ?? 'COMPETITIVE',
    text: q.text,
    option1: q.options[0],
    option2: q.options[1],
    option3: q.options[2],
    option4: q.options[3],
    correctOption: (q.type ?? 'COMPETITIVE') === 'POLL' ? null : (q.correct ?? null),
  }));
}

/** מחולל מספרים "אקראיים" קבוע — כדי שהנתונים יהיו זהים בכל הרצה */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

async function upsertUser(name: string, email: string, password: string, role: 'ADMIN' | 'HOST', isBlocked = false) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;
  return prisma.user.create({ data: { name, email, role, isBlocked, passwordHash: await bcrypt.hash(password, 10) } });
}

async function createGame(hostId: number, title: string, description: string, className: string, qs: Q[]) {
  return prisma.game.create({
    data: {
      hostId,
      title,
      description,
      questions: { create: questionRows(qs) },
      participants: { create: classParticipants(className) },
    },
    include: { questions: { orderBy: { order: 'asc' } }, participants: true },
  });
}

/** משחק שכבר הסתיים — עם תשובות וניקוד, כדי שיהיה סיכום לראות */
async function playFinishedGame(gameId: number) {
  const game = await prisma.game.findUniqueOrThrow({
    where: { id: gameId },
    include: { questions: { orderBy: { order: 'asc' } }, participants: { orderBy: { id: 'asc' } } },
  });
  const rand = seededRandom(gameId * 97);
  const start = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

  for (const p of game.participants) {
    let score = 0;
    for (const [qi, q] of game.questions.entries()) {
      if (rand() < 0.1) continue; // מדי פעם משתתפת לא ענתה
      const responseMs = Math.floor(1500 + rand() * 40_000);
      const correctChance = 0.55 + rand() * 0.35;
      let choice: number;
      if (q.type === 'POLL') choice = 1 + Math.floor(rand() * 4);
      else if (rand() < correctChance) choice = q.correctOption!;
      else choice = (((q.correctOption! - 1 + 1 + Math.floor(rand() * 3)) % 4) + 1);
      const isCorrect = q.type === 'COMPETITIVE' ? choice === q.correctOption : null;
      const points = isCorrect ? pointsForCorrect(responseMs) : 0;
      score += points;
      await prisma.answer.create({
        data: {
          participantId: p.id,
          questionId: q.id,
          choice,
          responseMs,
          isCorrect,
          points,
          createdAt: new Date(start.getTime() + qi * 70_000 + responseMs),
        },
      });
    }
    await prisma.participant.update({ where: { id: p.id }, data: { score } });
  }

  await prisma.game.update({
    where: { id: gameId },
    data: { status: 'FINISHED', startedAt: start, finishedAt: new Date(start.getTime() + game.questions.length * 70_000) },
  });
}

async function main() {
  // ===== מנהל מערכת =====
  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    if (isProd && adminPassword.length < 10) throw new Error('בסביבת Production סיסמת המנהל חייבת להיות לפחות 10 תווים');
    await upsertUser('מנהלת המערכת', adminEmail, adminPassword, 'ADMIN');
    console.log(`✔ מנהל: ${adminEmail}`);
  } else {
    console.log('ℹ לא הוגדרו SEED_ADMIN_EMAIL ו-SEED_ADMIN_PASSWORD — לא נוצר מנהל');
  }

  // ===== נתוני הדגמה =====
  if (process.env.SEED_DEMO !== 'true') {
    console.log('ℹ SEED_DEMO אינו true — מדלגים על נתוני הדגמה');
    return;
  }
  const hostPassword = process.env.SEED_HOST_PASSWORD ?? (isProd ? undefined : 'Host1234!');
  if (!hostPassword) throw new Error('בסביבת Production חובה להגדיר SEED_HOST_PASSWORD');

  const rachel = await upsertUser('רחל לוי', 'rachel.levi@kefclick.local', hostPassword, 'HOST');
  const miriam = await upsertUser('מרים כהנא', 'miriam.kahana@kefclick.local', hostPassword, 'HOST');
  const esther = await upsertUser('אסתר גולדברג', 'esther.goldberg@kefclick.local', hostPassword, 'HOST');
  const dvora = await upsertUser('דבורה שטרן', 'dvora.stern@kefclick.local', hostPassword, 'HOST', true);

  const hasGames = await prisma.game.count();
  if (hasGames > 0) {
    console.log('ℹ כבר קיימים משחקים — לא מוסיפים משחקי הדגמה שוב');
    return;
  }

  await createGame(rachel.id, 'חידון גיאוגרפיה — כיתה ו׳1', 'חזרה לקראת המבחן בגיאוגרפיה של ארץ ישראל', 'ו׳1', GEOGRAPHY);
  const solar = await createGame(rachel.id, 'חידון מדע: מערכת השמש — ו׳1', 'סיכום יחידת החלל', 'ו׳1', SOLAR_SYSTEM);
  await playFinishedGame(solar.id);

  await createGame(miriam.id, 'חידון ספר בראשית — כיתה ה׳2', 'מבראשית ועד יעקב אבינו', 'ה׳2', BERESHIT);
  await createGame(miriam.id, 'סקר: מסיבת סוף שנה — ה׳2', 'מחליטות יחד על המסיבה', 'ה׳2', PARTY_POLL);

  await createGame(esther.id, 'תחרות לוח הכפל — כיתה ד׳3', 'מי הכי מהירה בלוח הכפל?', 'ד׳3', TIMES_TABLE);

  await createGame(dvora.id, 'חידון חגי תשרי', 'חידון לפתיחת השנה', 'ד׳3', TISHREI);

  const counts = await Promise.all([prisma.user.count(), prisma.game.count(), prisma.question.count(), prisma.participant.count(), prisma.answer.count()]);
  console.log(`✔ נתוני הדגמה: ${counts[0]} משתמשים, ${counts[1]} משחקים, ${counts[2]} שאלות, ${counts[3]} משתתפות, ${counts[4]} תשובות`);
  console.log(`  מנחות: rachel.levi / miriam.kahana / esther.goldberg @kefclick.local (דבורה שטרן — חסומה)`);
}

main()
  .catch((e) => {
    console.error('❌ Seed נכשל:', e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
