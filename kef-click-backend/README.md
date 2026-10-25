# כיף Click — Backend

שרת למשחק חידונים תחרותי שעונים עליו בטלפון רגיל דרך **ימות המשיח**.

**ההתחלה:** אם זו הפעם הראשונה, התחילי ב־**[START-HERE.md](START-HERE.md)**.
**למפתחת ה־React:** ראי **[FRONTEND-API-GUIDE.md](FRONTEND-API-GUIDE.md)**.
**לחיבור הטלפון:** ראי **[docs/YEMOT-SETUP.md](docs/YEMOT-SETUP.md)**.

> ⚠️ **מצב הבדיקות בגרסה הזו:** בסביבה שבה הפרויקט נבנה הגישה ל־npm הייתה חסומה. לכן **לא ניתן היה להתקין את החבילות ולהריץ את הבדיקות, את בדיקת הטיפוסים ואת ה־Build.**
>
> מה כן נבדק בפועל:
> - ה־Migration רצה בהצלחה על PostgreSQL 16 אמיתי, כולל אילוצי התקינות.
> - כל 42 קובצי ה־TypeScript תקינים תחבירית.
> - קובץ ה־OpenAPI נוצר, וכל ההפניות בו תקינות.
>
> **לפני העלאה לענן:** הריצי `npm install`, ואז `npm run typecheck`, ‏`npm test` ו־`npm run build` (או בקשי מ־Claude לעשות זאת בשיחה שבה npm פתוח).

## טכנולוגיות
Node.js 22, Express, TypeScript (strict), PostgreSQL, Prisma, Zod, JWT, bcrypt (bcryptjs), Swagger / OpenAPI 3, Vitest.

## מבנה הפרויקט
```
src/
  app.ts, server.ts        יצירת השרת והפעלתו
  config/                  משתני סביבה (env.ts) וכללי המשחק (game.ts)
  db/                      חיבור Prisma
  middleware/              אימות (JWT), הרשאות, ולידציה, טיפול בשגיאות
  modules/
    auth/                  הרשמה, התחברות, me
    admin/                 ניהול מנחים וכל המשחקים
    games/                 משחקים, משתתפים, שאלות
    gameplay/              מנוע המשחק: לובי, שאלה, חשיפה, ניקוד, מצב חי
    yemot/                 החיבור לימות המשיח
  docs/openapi.ts          תיעוד Swagger
  utils/                   כלים קטנים (שגיאות, טלפונים)
prisma/
  schema.prisma            הטבלאות
  migrations/              Migrations
  seed.ts                  נתוני הדגמה
tests/                     בדיקות אוטומטיות (מול PostgreSQL אמיתי)
docs/openapi.json          קובץ OpenAPI
```

כל מודול מחולק ל־`routes` (כתובות), `controller` (קבלת הבקשה), `service` (הלוגיקה) ו־`schemas` (ולידציה).

## הרצה במחשב
דרישות: Node.js 20 ומעלה, ו־PostgreSQL (במחשב או בענן).

```bash
npm install
cp .env.example .env          # ולמלא DATABASE_URL, JWT_SECRET, YEMOT_SECRET
npx prisma migrate dev        # יוצר את הטבלאות
npm run db:seed               # נתוני הדגמה
npm run dev                   # http://localhost:4000/api-docs
```

### חשבונות הדגמה (אחרי seed, עם הערכים מ־.env.example)

| תפקיד | אימייל | סיסמה |
|---|---|---|
| מנהל | `admin@kefclick.local` | `Admin1234!` |
| מנחה | `rachel.levi@kefclick.local` | `Host1234!` |
| מנחה | `miriam.kahana@kefclick.local` | `Host1234!` |
| מנחה | `esther.goldberg@kefclick.local` | `Host1234!` |
| מנחה חסומה | `dvora.stern@kefclick.local` | `Host1234!` (ההתחברות נכשלת, 403) |

**נתוני ההדגמה:**
- 3 כיתות (ד׳3, ה׳2, ו׳1) עם 58 תלמידות.
- 6 משחקים: גיאוגרפיה, מערכת השמש (כבר שוחק, עם סיכום), ספר בראשית, סקר מסיבה, לוח הכפל וחגי תשרי.
- כל השמות מומצאים. מספרי הטלפון (`0500000XXX`) לא שייכים לאנשים אמיתיים. **לפני משחק אמיתי מחליפים אותם במספרים האמיתיים.**

## בדיקות
הבדיקות רצות מול **PostgreSQL אמיתי**, במסד נפרד בשם `kefclick_test` שנמחק ונבנה מחדש בכל הרצה.

```bash
# ברירת מחדל: postgresql://postgres:postgres@localhost:5432/kefclick_test
TEST_DATABASE_URL="postgresql://..." npm test
npm run typecheck
npm run build
```

**מה נבדק:**
- הרשמה, התחברות, Token חסר, לא תקין או שפג תוקפו, וחסימה.
- הרשאות מנהל ומנחה, ופרטיות בין מנחים.
- CRUD של משחקים, משתתפים ושאלות, כולל ולידציה, חיפוש, סינון ומיון.
- משחק מלא: ניקוד לפי שניות, סגירה מוקדמת, חשיפה, מעבר אוטומטי, השהיה והמשך, סיום, שוויון וסקר.
- 20 משתתפות שעונות בו־זמנית.
- ימות המשיח: פורמט, מפתח, ניתוק.
- התאמה בין Swagger לנתיבים, תקינות Prisma ו־Migrations.

## כללי המשחק (src/config/game.ts)
- 60 שניות לשאלה. השאלה נסגרת מיד אם כל המשתתפים המחוברים ענו.
- 5 שניות חשיפה, ואז מעבר אוטומטי.
- ניקוד: 1000, פחות 10 על כל שנייה שלמה (שנייה 59 = 410). תשובה שגויה או סקר = 0.
- שוויון בנקודות נשבר לפי סכום זמני התשובות הנכונות, במילישניות.
- אין טיימרים ברקע. המצב מחושב לפי השעון בכל קריאה, ושורת המשחק ננעלת במסד הנתונים (`FOR UPDATE`). כך אין התנגשויות בין תשובות שמגיעות בו־זמנית.
