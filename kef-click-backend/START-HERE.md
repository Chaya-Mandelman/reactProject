# 🚀 מתחילות כאן: העלאת כיף Click לאינטרנט

המדריך הזה מיועד למי שמעולם לא העלתה שרת לאינטרנט. עוברים שלב אחרי שלב, ולא מדלגים.

> ⚠️ **הערה חשובה:** האתרים GitHub,‏ Neon,‏ Render וימות המשיח משנים מדי פעם את העיצוב ואת שמות הכפתורים. כתבתי את השמות כפי שהם מוכרים לי, אבל לא יכולתי לבדוק את המסכים העדכניים. אם כפתור לא נראה בדיוק כמו בתיאור, חפשי כפתור עם משמעות דומה.

**מה נעשה:**
1. **GitHub:** שומרים בו את הקוד.
2. **Neon:** מסד הנתונים PostgreSQL, בחינם.
3. **Render:** מריץ את השרת באינטרנט, בחינם.
4. **ימות המשיח:** מחברים את הטלפון לשרת.
5. **בדיקה:** מוודאים שהכול עובד.

---

## חלק א: GitHub (שמירת הקוד)

### 1. פתיחת חשבון
1. נכנסים ל־https://github.com
2. לוחצים **Sign up**.
3. ממלאים אימייל, סיסמה ושם משתמש, ומאשרים את האימייל.

### 2. יצירת Repository (תיקייה לפרויקט)
1. אחרי הכניסה לוחצים על **+** בפינה העליונה, ואז **New repository**.
2. **Repository name:** `kef-click-backend`
3. בוחרים **Private** (פרטי). כך הקוד לא גלוי לכולם.
4. **לא** מסמנים "Add a README file", כי יש לנו כבר אחד.
5. לוחצים **Create repository**.

### 3. חילוץ ה־ZIP
1. במחשב, לוחצים קליק ימני על הקובץ `kef-click-backend.zip`.
2. בוחרים **חלץ הכל** (Extract All).
3. נוצרת תיקייה בשם `kef-click-backend`, ובתוכה `src`, `prisma`, `package.json` ועוד.

### 4. העלאת הקבצים דרך הדפדפן
1. בעמוד ה־Repository החדש לוחצים על הקישור **uploading an existing file**.
2. פותחים את התיקייה `kef-click-backend` שחילצת, ו**מסמנים את כל מה שבתוכה** (Ctrl+A).
3. גוררים את כל הקבצים והתיקיות לחלון הדפדפן.
   - ⚠️ גוררים את **התוכן** של התיקייה, לא את התיקייה עצמה. ב־GitHub הקובץ `package.json` חייב להופיע ישר בעמוד הראשי, לא בתוך תת־תיקייה.
   - ⚠️ קבצים שמתחילים בנקודה (`.gitignore`, `.env.example`) לפעמים מוסתרים במחשב. ב־Windows: בסייר הקבצים ← **תצוגה** ← סמני **פריטים מוסתרים**.
4. למטה, ב־**Commit changes**, לוחצים על הכפתור הירוק **Commit changes**.

### 5. בדיקה שהקבצים הגיעו
בעמוד הראשי של ה־Repository צריך לראות: `src`, `prisma`, `tests`, `docs`, `package.json`, `package-lock.json`, `render.yaml`, `README.md` ועוד.

אם `package-lock.json` חסר, ראי בפתרון תקלות למטה.

---

## חלק ב: מסד נתונים (Neon, PostgreSQL בחינם)

> למה לא מסד הנתונים של Render? מסד נתונים חינמי ב־Render **נמחק אחרי 30 יום**. ב־Neon יש מסלול חינמי קבוע, עם מגבלות נפח שמספיקות לפרויקט כזה. אפשר גם להשתמש ב־Supabase (ראי בסוף החלק).

### 1. פתיחת חשבון
1. נכנסים ל־https://neon.tech
2. לוחצים **Sign up**. הכי פשוט להתחבר עם חשבון ה־GitHub.

### 2. יצירת מסד נתונים
1. לוחצים **Create project** (או **New Project**).
2. **Project name:** `kef-click`
3. **Region:** בוחרים אזור באירופה (למשל Frankfurt). זה הכי קרוב לישראל ול־Render.
4. **Postgres version:** משאירים את ברירת המחדל.
5. לוחצים **Create**.

### 3. קבלת Connection String (כתובת החיבור)
1. בלוח הבקרה של הפרויקט לוחצים **Connect** (או מוצאים את **Connection string**).
2. בוחרים את ה־Database `neondb`.
3. מעתיקים את הכתובת. היא נראית כך:
   ```
   postgresql://neondb_owner:XXXXXXXX@ep-xxx-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
4. אם יש אפשרות **Pooled connection**, אפשר להשאיר את ברירת המחדל. Prisma עובד עם שתיהן.

### 4. שמירה בטוחה
- הכתובת כוללת **סיסמה**. אל תשלחי אותה לאף אחד, ואל תכתבי אותה באף קובץ שעולה ל־GitHub.
- שמרי אותה זמנית בפתקים, ומחקי אחרי שהדבקת אותה ב־Render.

### 5. חיבור השרת למסד הנתונים
את הכתובת מדביקים ב־Render כ־`DATABASE_URL` (חלק ג, שלב 6).

**חלופה, Supabase:** פותחים פרויקט ב־https://supabase.com, לוחצים **Connect**, ומעתיקים את ה־**Session pooler** connection string (פורט 5432). במקום `[YOUR-PASSWORD]` שמים את הסיסמה שבחרת ביצירת הפרויקט.

---

## חלק ג: Render (הרצת השרת באינטרנט)

### 1. פתיחת חשבון
1. נכנסים ל־https://render.com
2. לוחצים **Get Started**, ואז **GitHub**, כדי להתחבר עם חשבון ה־GitHub.

### 2. חיבור GitHub
בפעם הראשונה Render מבקש גישה ל־GitHub. בוחרים **Only select repositories**, מסמנים את `kef-click-backend`, ולוחצים **Install** (או **Authorize**).

### 3. יצירת Web Service
1. בלוח הבקרה לוחצים **+ New**, ואז **Web Service**.

### 4. בחירת ה־Repository
1. ברשימה בוחרים את `kef-click-backend` ולוחצים **Connect**.

### 5. הגדרת Build ו־Start
ממלאים בדיוק כך:

| שדה | ערך |
|---|---|
| **Name** | `kef-click-backend` (זה ייקבע את הכתובת) |
| **Region** | Frankfurt (EU Central) |
| **Branch** | `main` |
| **Root Directory** | משאירים ריק |
| **Runtime / Language** | `Node` |
| **Build Command** | `npm install --include=dev && npm run build` |
| **Start Command** | `npx prisma migrate deploy && node dist/server.js` |
| **Instance Type** | **Free** |

### 6. משתני סביבה (Environment Variables)
גוללים ל־**Environment Variables** ולוחצים **Add Environment Variable** לכל שורה:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `NODE_VERSION` | `22` |
| `DATABASE_URL` | הכתובת מ־Neon (חלק ב) |
| `JWT_SECRET` | מחרוזת אקראית ארוכה, **לפחות 32 תווים** (ראי הסבר מתחת) |
| `JWT_EXPIRES_IN` | `8h` |
| `CORS_ORIGIN` | כתובת אתר ה־React שלך, למשל `https://my-app.vercel.app`. בזמן פיתוח אפשר `*` |
| `YEMOT_SECRET` | מילת סוד שתמציאי, למשל `kef-click-7c2f9a41`. תצטרכי אותה בהגדרת ימות המשיח |

**איך ממציאים JWT_SECRET:** יש ליד השדה כפתור **Generate**. אם הוא קיים, לוחצים עליו. אם לא, מקלידים מחרוזת ארוכה של אותיות וספרות באנגלית, בלי רווחים (לפחות 32 תווים).

### 7. Prisma Migrations
אין צורך בשלב נפרד. ה־**Start Command** מתחיל ב־`npx prisma migrate deploy`, ולכן בכל הפעלה הטבלאות נוצרות או מתעדכנות אוטומטית.

### 8. Deploy
1. לוחצים **Create Web Service** (או **Deploy Web Service**).
2. בחלון ה־Logs רואים את התהליך. זה לוקח כמה דקות.
3. כשמופיע `✅ כיף Click פועל על פורט ...` והסטטוס הופך ל־**Live**, השרת באוויר.

### 9. בדיקה שהשרת פעיל
למעלה מופיעה הכתובת, למשל `https://kef-click-backend.onrender.com`.
פותחים בדפדפן: `https://kef-click-backend.onrender.com/api/health`
וצריך לראות: `{"status":"ok","database":"ok",...}`

### 10. יצירת חשבון מנהל ונתוני הדגמה (פעם אחת)
מסד הנתונים מתחיל ריק. כדי ליצור מנהל, ואם תרצי גם את נתוני ההדגמה (מורות, כיתות ומשחקים):

1. ב־Render, בשירות שלך ← **Environment**, מוסיפים זמנית:

   | Key | Value |
   |---|---|
   | `SEED_ADMIN_EMAIL` | האימייל שלך |
   | `SEED_ADMIN_PASSWORD` | סיסמה חזקה (לפחות 10 תווים) |
   | `SEED_DEMO` | `true` (או `false` אם לא רוצים נתוני הדגמה) |
   | `SEED_HOST_PASSWORD` | סיסמה למנחות ההדגמה |

2. משנים זמנית את **Start Command** ל:
   ```
   npx prisma migrate deploy && npx tsx prisma/seed.ts && node dist/server.js
   ```
3. שומרים, ואז בוחרים **Manual Deploy** ← **Deploy latest commit**.
4. ב־Logs מופיע `✔ מנהל: ...`.
5. **מחזירים את ה־Start Command למקורי:** `npx prisma migrate deploy && node dist/server.js`
6. מוחקים את `SEED_ADMIN_PASSWORD` ו־`SEED_HOST_PASSWORD` מה־Environment.

> אפשר להריץ את ה־Seed שוב בלי חשש. הוא לא יוצר כפילויות.

> ⏰ **שימי לב, השרת "נרדם":** בשרת חינמי ב־Render, אחרי 15 דקות בלי שימוש השרת נרדם, והקריאה הראשונה אחריו לוקחת בערך דקה. **לפני משחק**, פתחי את `/api/health` וחכי שיענה. בזמן המשחק מסך המנחה מרענן כל שנייה, ולכן השרת נשאר ער.

---

## חלק ד: חיבור ימות המשיח

ההגדרות המלאות נמצאות בקובץ [`docs/YEMOT-SETUP.md`](docs/YEMOT-SETUP.md).

בקצרה: יוצרים שלוחה מסוג API, שהכתובת שלה היא:
```
api_link=https://kef-click-backend.onrender.com/api/yemot/call
api_add_0=key=<הערך של YEMOT_SECRET>
```

---

## חלק ה: בדיקה שהכול עובד

1. **בריאות:** פותחים `https://<הכתובת-שלך>/api/health` ורואים `"status":"ok"`.
2. **Swagger:** פותחים `https://<הכתובת-שלך>/api-docs` ורואים את כל ה־API.
3. **התחברות מתוך Swagger:**
   1. פותחים `POST /api/auth/login`.
   2. לוחצים **Try it out**.
   3. כותבים בגוף הבקשה את האימייל והסיסמה שהגדרת ב־Seed.
   4. לוחצים **Execute**.
4. **קבלת JWT:** בתשובה (Response body) מופיע `"token": "eyJ..."`. מעתיקים את הערך, בלי המירכאות.
5. **Authorize:** לוחצים על הכפתור **Authorize** 🔓 למעלה, מדביקים את ה־token בשדה **Value**, ולוחצים **Authorize** ואז **Close**.
6. **קריאה מוגנת:** פותחים `GET /api/auth/me` ← **Try it out** ← **Execute**. אמורים לראות את הפרטים שלך (200).
   - כדי לבדוק שהאבטחה עובדת: לוחצים **Authorize** ← **Logout**, ומריצים שוב. אמורה לחזור **401**.
7. **הוספת רשומה:** מתחברים כמנחה (או נרשמים ב־`POST /api/auth/register`), ואז מריצים `POST /api/games` עם:
   ```json
   { "title": "המשחק הראשון שלי" }
   ```
   התשובה (201) כוללת `"id"`.
8. **שליפה ממסד הנתונים:** מריצים `GET /api/games` ורואים את המשחק ברשימה. זה אומר שהוא נשמר ב־PostgreSQL.

**סימולציה של משחק בלי טלפון (מתוך Swagger):**
1. מוסיפים למשחק שאלה (`POST /api/games/{id}/questions`) ומשתתף עם טלפון, למשל `0500000777`.
2. מריצים `POST /api/games/{id}/lobby`.
3. ב־`GET /api/yemot/call` ממלאים `key` (הערך של YEMOT_SECRET) ו־`ApiPhone` ‏`0500000777`, ומריצים. זה כמו שהמשתתף התקשר.
4. מריצים `POST /api/games/{id}/start`.
5. שוב `GET /api/yemot/call`, הפעם גם עם `answer` ‏`1`. זה כמו שהמשתתף הקיש 1.
6. מריצים `GET /api/games/{id}/live` ורואים את התשובה ואת הניקוד.

---

## חלק ו: פתרון תקלות

| תקלה | מה רואים | פתרון |
|---|---|---|
| **Build Failed** | ב־Logs: `npm ERR!` או `npm ci` נכשל | בדקי ש־`package.json` ו־`package-lock.json` נמצאים בעמוד הראשי של ה־Repository, לא בתת־תיקייה. אם `package-lock.json` חסר, שני את Build Command ל־`npm install --include=dev && npm run build` |
| **Build Failed: tsc** | שגיאות TypeScript ב־Logs | העתיקי את השגיאה ושלחי אותה ל־Claude |
| **DATABASE_URL שגוי** | `P1001: Can't reach database server` או `P1000: Authentication failed` | העתיקי שוב את הכתובת מ־Neon, בלי רווחים ובלי מירכאות. בדקי שבסוף יש `?sslmode=require` |
| **בעיית Prisma** | `P3009` או `migrate found failed migrations` | ב־Neon מחקי את ה־Database וצרי חדש (אם אין בו מידע חשוב), ועשי Deploy מחדש |
| **JWT_SECRET חסר או קצר** | ב־Logs: `❌ משתני סביבה לא תקינים: JWT_SECRET...` | הוסיפי JWT_SECRET באורך 32 תווים לפחות, ועשי Deploy מחדש |
| **YEMOT_SECRET חסר** | ב־Logs: `YEMOT_SECRET חייב להיות לפחות 8 תווים` | הוסיפי YEMOT_SECRET |
| **שגיאת CORS** | בדפדפן של ה־React: `blocked by CORS policy` | ב־`CORS_ORIGIN` שימי את הכתובת המדויקת של אתר ה־React, בלי `/` בסוף. אפשר כמה כתובות מופרדות בפסיק. לבדיקה: `*` |
| **401** | `חסר Token` או `Token לא תקין` | לא שלחת `Authorization: Bearer <token>`, או שה־Token פג (8 שעות). התחברי מחדש |
| **403** | `אין לך הרשאה` | התפקיד לא מתאים (למשל מנחה שמנסה להיכנס לניהול), או שהחשבון חסום |
| **Swagger לא נפתח** | דף ריק או שגיאה | פתחי בדיוק `/api-docs` (עם מקף). חכי דקה אם השרת "נרדם" |
| **השרת לא עולה** | הסטטוס ב־Render לא הופך ל־Live | קראי את ה־Logs: בדרך כלל זה משתנה סביבה חסר, או DATABASE_URL שגוי |
| **ימות המשיח: "אין מענה משרת API"** | ההודעה נשמעת בטלפון | השרת ישן (פתחי את `/api/health` וחכי), או שה־api_link שגוי |
| **ימות המשיח: "המספר שלך אינו רשום"** | ההודעה נשמעת בטלפון | הטלפון לא רשום במשחק, או שהמשחק לא בלובי. צריך ללחוץ קודם "פתח לובי" |

---

## להרצה במחשב שלך (לא חובה)

ראי [README.md](README.md).
