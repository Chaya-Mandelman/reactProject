# כיף Click

מערכת לחידונים תחרותיים בכיתה. המנחה (מורה) יוצרת משחק עם שאלות ורשימת משתתפות, מנהלת אותו מהמחשב, והמשתתפות עונות מטלפון רגיל דרך **ימות המשיח**. הניקוד נקבע לפי מהירות התשובה, ובסוף המשחק מוצגים טבלת מובילות וסיכום. יש גם שאלות סקר בלי ניקוד.

מנהל המערכת מנהל את המנחות (חסימה, עריכה, מחיקה) ורואה את כל המשחקים.
## משתמש לדוגמה
החשבון הזה קיים באתר שבאוויר (מסד הנתונים ב־Neon), וכבר יש לו משחקים, שאלות, משתתפות ותוצאות.

| תפקיד | אימייל | סיסמה |
|---|---|---|
| מנחה: מורה לתכנות | `programming.teacher@kefclick.local` | `Code1234!` |

**המשחקים שלה:**

| משחק | שאלות | מצב |
|---|---|---|
| חידון React | 8 | הסתיים, יש טבלת מובילות וסיכום |
| חידון CSS | 7 | הסתיים, יש טבלת מובילות וסיכום |
| חידון JavaScript | 7 | מוכן להפעלה |
| מיקס: React, C#, Java ועוד | 8 | מוכן להפעלה |

בכל משחק יש 15 משתתפות. השמות מומצאים, ומספרי הטלפון (`0500009XXX`) לא שייכים לאנשים אמיתיים.

בהרצה מקומית, `npm run db:seed` יוצר משתמשי הדגמה אחרים: `admin@kefclick.local` / `Admin1234!` ו־`rachel.levi@kefclick.local` / `Host1234!`.


## מבנה הריפו

| תיקייה | תפקיד |
|---|---|
| `kef-click-backend/` | השרת: Node.js, Express, Prisma, PostgreSQL |
| `klickfun/` | הקליינט: React, Vite |


## דרישות מוקדמות
- Node.js בגרסה 20 ומעלה
- PostgreSQL, מקומי או בענן (למשל Neon)

## התקנת החבילות

```bash
cd kef-click-backend
npm install
```

```bash
cd klickfun
npm install
```

## משתני סביבה

### שרת: `kef-click-backend/.env`
מעתיקים את `.env.example` לקובץ `.env` וממלאים ערכים.

| משתנה | חובה | תיאור |
|---|---|---|
| `DATABASE_URL` | כן | כתובת החיבור ל־PostgreSQL |
| `JWT_SECRET` | כן | מפתח לחתימת Token, לפחות 32 תווים |
| `YEMOT_SECRET` | כן | המפתח שימות המשיח שולח, לפחות 8 תווים |
| `JWT_EXPIRES_IN` | לא | תוקף ה־Token (ברירת מחדל `8h`) |
| `PORT` | לא | פורט השרת (ברירת מחדל `4000`) |
| `CORS_ORIGIN` | לא | הכתובות שמותר להן לפנות לשרת, מופרדות בפסיקים |
| `SEED_DEMO` | לא | `true` כדי ליצור נתוני הדגמה |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | לא | חשבון המנהל שנוצר ב־Seed |
| `SEED_HOST_PASSWORD` | לא | הסיסמה של המנחות לדוגמה |

### קליינט: `klickfun/.env`

| משתנה | תיאור |
|---|---|
| `VITE_API_URL` | כתובת ה־API. מקומית: `http://localhost:4000/api` |
| `VITE_ENABLE_ANALYTICS` | `true` / `false` |

## הפעלת השרת

```bash
cd kef-click-backend
npx prisma migrate dev
npm run db:seed
npm run dev
```

`migrate` יוצר את הטבלאות, ו־`db:seed` מוסיף משתמשים ונתוני הדגמה. מספיק להריץ את שניהם פעם אחת. אחר כך מספיק `npm run dev`.

## הפעלת הקליינט

```bash
cd klickfun
npm run dev
```

## פורטים וכתובות

| מה | כתובת |
|---|---|
| קליינט | http://localhost:5173 |
| שרת (API) | http://localhost:4000/api |
| Swagger | http://localhost:4000/api-docs |
| בדיקת תקינות | http://localhost:4000/api/health |

## עמודים בקליינט

| נתיב | עמוד | הרשאה |
|---|---|---|
| `/` | דף הבית | כולם |
| `/login` | התחברות | כולם |
| `/register` | הרשמה | כולם |
| `/games` | המשחקים שלי | מנחה |
| `/games/edit/:gameId` | עריכת משחק, שאלות ומשתתפות | מנחה |
| `/play/:gameId/lobby` | לובי: מחכים שהמשתתפות יתחברו | מנחה |
| `/play/:gameId/game` | המשחק החי: שאלה, חשיפה, טבלת מובילות וסיכום | מנחה |
| `/admin/games` | ניהול כל המשחקים | מנהל |
| `/admin/hosts` | ניהול המנחות | מנהל |

## ספריות מרכזיות

**שרת:** Express, Prisma (ORM ל־PostgreSQL), Zod (ולידציה), jsonwebtoken (JWT), bcryptjs (הצפנת סיסמאות), swagger-ui-express, Vitest ו־Supertest (בדיקות).

**קליינט:** React 19, React Router, TanStack Query (קריאות לשרת וניהול Cache), Axios, React Hook Form עם Zod (טפסים וולידציה), Redux Toolkit, Tailwind CSS.

## כשהמערכת לא עולה

| הבעיה | מה לעשות |
|---|---|
| השרת נסגר ומופיע "משתני סביבה לא תקינים" | חסר קובץ `.env`, או ש־`JWT_SECRET` קצר מ־32 תווים. משווים מול `.env.example` |
| שגיאת חיבור למסד הנתונים | בודקים שה־PostgreSQL פועל ושה־`DATABASE_URL` נכון |
| שגיאה שטבלה לא קיימת | מריצים `npx prisma migrate dev` |
| אי אפשר להתחבר עם המשתמשים לדוגמה | מריצים `npm run db:seed` |
| שגיאה שהפורט תפוס (`EADDRINUSE`) | סוגרים את השרת שכבר רץ, או משנים את `PORT` |
| הקליינט עולה אבל אין נתונים או שיש שגיאת רשת | בודקים את `VITE_API_URL` ומפעילים מחדש את `npm run dev` של הקליינט |
| שגיאת CORS בדפדפן | מוסיפים את כתובת הקליינט ל־`CORS_ORIGIN` ומפעילים מחדש את השרת |
| שגיאות אחרי משיכת קוד חדש | מריצים שוב `npm install` בשתי התיקיות |
| בפעם הראשונה השרת בענן (Render) איטי | השרת "מתעורר" אחרי שינה. מחכים כדקה ומרעננים |

## תיעוד נוסף
- [kef-click-backend/README.md](kef-click-backend/README.md): פרטי השרת, בדיקות וכללי המשחק
- [kef-click-backend/START-HERE.md](kef-click-backend/START-HERE.md): העלאה לענן (Neon ו־Render)
- [kef-click-backend/FRONTEND-API-GUIDE.md](kef-click-backend/FRONTEND-API-GUIDE.md): מדריך ה־API לקליינט
- [kef-click-backend/docs/YEMOT-SETUP.md](kef-click-backend/docs/YEMOT-SETUP.md): חיבור ימות המשיח
