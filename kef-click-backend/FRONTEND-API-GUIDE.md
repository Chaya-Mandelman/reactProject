# מדריך API לכתיבת צד ה־React — כיף Click

המסמך הזה מסביר איך האתר שלך (React) מדבר עם השרת. **אין כאן קוד React.** את זה את כותבת בעצמך.

---

## 1. כתובת השרת (Base URL)

| סביבה | כתובת |
|---|---|
| במחשב שלך | `http://localhost:4000` |
| בענן (Render) | `https://<שם-השירות-שלך>.onrender.com` |

כדאי לשמור את הכתובת במשתנה סביבה של פרויקט ה־React (למשל `VITE_API_URL`), כדי שלא תצטרכי לשנות קוד במעבר לענן.

כל הנתיבים מתחילים ב־`/api`. התיעוד החי נמצא ב־`/api-docs`.

---

## 2. התחברות ו־Token

1. שולחים `POST /api/auth/login` (או `/api/auth/register` למנחה חדש).
2. מקבלים `token` ושומרים אותו (למשל ב־localStorage).
3. **בכל בקשה מוגנת** שולחים כותרת (Header):

```
Authorization: Bearer <token>
```

4. אחרי רענון של הדף: קוראים ל־`GET /api/auth/me` עם ה־Token. אם חוזר 200, המשתמש מחובר. אם חוזר 401, מחזירים אותו למסך ההתחברות.
5. **התפקיד (`role`)** בתשובה קובע אילו מסכים להציג:
   - `ADMIN`: מסכי הניהול.
   - `HOST`: המשחקים שלי.

**תוקף ה־Token:** 8 שעות (ניתן לשינוי ב־`JWT_EXPIRES_IN`). אחרי שהוא פג, כל בקשה תחזיר 401, וצריך להתחבר מחדש.

---

## 3. פורמט שגיאות

כל שגיאה חוזרת באותו מבנה:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "הנתונים שנשלחו אינם תקינים",
    "details": [
      { "field": "title", "message": "שם המשחק קצר מדי" }
    ]
  }
}
```

- `message` היא הודעה בעברית שאפשר להציג למשתמש כמו שהיא.
- `details` מופיע בשגיאת 400, ובו שגיאה לכל שדה. אפשר להציג כל הודעה ליד השדה המתאים בטופס.

| קוד | מתי | מה לעשות במסך |
|---|---|---|
| 400 | קלט לא תקין | להציג את השגיאות ליד השדות |
| 401 | אין Token, או שהוא לא תקין או שפג תוקפו | להעביר למסך התחברות |
| 403 | אין הרשאה, או שהחשבון חסום | להציג "אין הרשאה" |
| 404 | לא נמצא, או שייך למנחה אחר | להציג "לא נמצא" |
| 409 | הפעולה לא מתאימה למצב (למשל עריכה בזמן משחק) | להציג את `message` |
| 429 | יותר מדי ניסיונות התחברות או הרשמה | להציג את `message` |
| 500 | תקלה בשרת | "משהו השתבש, נסי שוב" |

---

## 4. מבני הנתונים

### User (משתמש)
```json
{ "id": 2, "name": "רחל לוי", "email": "rachel.levi@kefclick.local", "role": "HOST", "isBlocked": false, "createdAt": "2026-10-23T08:00:00.000Z" }
```

### Game (משחק מלא)
```json
{
  "id": 1,
  "title": "חידון גיאוגרפיה — כיתה ו׳1",
  "description": "חזרה לקראת המבחן",
  "status": "SETUP",
  "host": { "id": 2, "name": "רחל לוי" },
  "createdAt": "...", "updatedAt": "...",
  "questions": [ /* Question[] */ ],
  "participants": [ { "id": 1, "name": "שירה כהן", "phone": "0500000001" } ]
}
```

**סטטוסים (`status`):**

| ערך | משמעות | מותר לערוך? |
|---|---|---|
| `SETUP` | הכנה | ✅ |
| `LOBBY` | לובי: מחכים שהמשתתפים יתקשרו | ❌ |
| `RUNNING` | המשחק רץ | ❌ |
| `PAUSED` | מושהה | ❌ |
| `FINISHED` | הסתיים (הסיכום זמין) | ✅ |

### Question (שאלה)
```json
{
  "id": 7, "order": 1, "type": "COMPETITIVE",
  "text": "מהי עיר הבירה של ישראל?",
  "option1": "תל אביב", "option2": "ירושלים", "option3": "חיפה", "option4": "באר שבע",
  "correctOption": 2
}
```
- `type`: `COMPETITIVE` (תחרותית) או `POLL` (סקר).
- `correctOption`: מספר בין 1 ל־4. בסקר הערך הוא `null`.

---

## 5. מסכים ← אילו קריאות צריך

### מסך התחברות
| פעולה | קריאה |
|---|---|
| כניסה | `POST /api/auth/login` עם `{ "email", "password" }` |
| הרשמה כמנחה | `POST /api/auth/register` עם `{ "name", "email", "password" }` |

**שדות חובה בהרשמה:**
- `name`: 2 עד 80 תווים.
- `email`: אימייל תקין.
- `password`: לפחות 8 תווים, כולל אות באנגלית וספרה.

ההצלחה מחזירה (201 בהרשמה, 200 בהתחברות):
```json
{ "token": "eyJhbGci...", "user": { "id": 5, "name": "מרים", "email": "miriam@example.com", "role": "HOST", "isBlocked": false, "createdAt": "..." } }
```

### ניהול מנחים (מנהל)
| פעולה | קריאה |
|---|---|
| רשימה | `GET /api/admin/hosts?search=רחל&blocked=true` (שני הפרמטרים לא חובה) |
| הוספה | `POST /api/admin/hosts` עם `{ "name", "email", "password" }` |
| עריכה | `PATCH /api/admin/hosts/:id` עם השדות שמשתנים בלבד |
| חסימה | `PATCH /api/admin/hosts/:id` עם `{ "isBlocked": true }` |
| שחרור | `PATCH /api/admin/hosts/:id` עם `{ "isBlocked": false }` |

כל מנחה ברשימה כולל גם `gamesCount`.

### כל המשחקים (מנהל)
| פעולה | קריאה |
|---|---|
| רשימה | `GET /api/admin/games?search=&status=&hostId=&sort=newest` |
| צפייה | `GET /api/games/:id` |
| מחיקה | `DELETE /api/games/:id` (מחזיר 204 בלי גוף) |

### המשחקים שלי (מנחה)
| פעולה | קריאה |
|---|---|
| רשימה | `GET /api/games?search=חידון&status=SETUP&sort=title` |
| יצירה | `POST /api/games` עם `{ "title", "description" }` |
| שכפול | `POST /api/games/:id/duplicate` |
| מחיקה | `DELETE /api/games/:id` |

- `sort`: `newest` (ברירת מחדל), `oldest` או `title`.
- כל משחק ברשימה כולל `questionsCount` ו־`participantsCount`.
- **שדות חובה ביצירת משחק:** `title` (2 עד 100 תווים). `description` לא חובה (עד 500 תווים).

### עריכת משחק (מנחה)
| פעולה | קריאה |
|---|---|
| טעינה | `GET /api/games/:id` |
| שם ותיאור | `PATCH /api/games/:id` |
| הוספת משתתף | `POST /api/games/:id/participants` עם `{ "name", "phone" }` |
| עריכת משתתף | `PATCH /api/games/:id/participants/:pid` |
| מחיקת משתתף | `DELETE /api/games/:id/participants/:pid` |
| הוספת שאלה | `POST /api/games/:id/questions` |
| עריכת שאלה | `PATCH /api/games/:id/questions/:qid` |
| מחיקת שאלה | `DELETE /api/games/:id/questions/:qid` |
| סדר שאלות | `PUT /api/games/:id/questions/order` עם `{ "questionIds": [3, 1, 2] }` |

**טופס משתתף:**
- `name`: 2 עד 60 תווים.
- `phone`: אפשר להקליד עם מקפים או עם ‎+972. השרת שומר רק ספרות (`0501234567`).
- אם הטלפון כבר רשום באותו משחק, חוזר 409.

**טופס שאלה:**
```json
{ "type": "COMPETITIVE", "text": "כמה ימים יש בשבוע?", "option1": "5", "option2": "6", "option3": "7", "option4": "8", "correctOption": 3 }
```
- שדות חובה: `text` (2 עד 300 תווים) ו־`option1` עד `option4` (עד 120 תווים כל אחד). ארבע התשובות חייבות להיות שונות זו מזו.
- `type` לא חובה. ברירת המחדל היא `COMPETITIVE`.
- בשאלה תחרותית `correctOption` חובה (1 עד 4). בסקר לא שולחים אותו.
- בעריכה (`PATCH`) אפשר לשלוח רק את מה שהשתנה.

כשהמשחק ב־`LOBBY`, `RUNNING` או `PAUSED`, כל עריכה מחזירה 409. כדאי לנטרל את כפתורי העריכה במצבים האלה.

### לובי, מסך שאלה, חשיפה וסיכום (מנחה)
| פעולה | קריאה |
|---|---|
| פתיחת לובי | `POST /api/games/:id/lobby` |
| התחלה | `POST /api/games/:id/start` |
| השהיה | `POST /api/games/:id/pause` |
| המשך | `POST /api/games/:id/resume` |
| לשאלה הבאה (מהחשיפה) | `POST /api/games/:id/next` |
| עצירה | `POST /api/games/:id/stop` |
| **רענון המסך** | `GET /api/games/:id/live?afterAnswerId=<מספר>` **כל שנייה** |

כל פעולות השליטה מחזירות את אותו מבנה כמו `/live`, כך שאפשר לעדכן את המסך מיד.

**`stop`:**
- מהלובי: חזרה להכנה.
- באמצע משחק: סיום מיידי עם סיכום.

**פתיחת לובי עלולה להחזיר 409, למשל:**
- אין שאלות או משתתפים.
- טלפון של משתתף כבר נמצא במשחק פעיל אחר. במקרה כזה `details` מפרט אילו טלפונים ובאיזה משחק.

---

## 6. המסך החי: `/live` בפירוט

ה־React מבקש `/live` כל שנייה ומציג לפי השדה **`phase`**:

| `phase` | מה להציג |
|---|---|
| `SETUP` | המשחק בהכנה |
| `LOBBY` | רשימת `participants`, עם סימון למי ש־`connected: true`, ואת `connectedCount` |
| `QUESTION` | `question`, טיימר לפי `timeLeftMs`, `answeredCount`, השמות הקופצים ו־`fastest` בצד |
| `REVEAL` | התשובה הנכונה (`question.correctOption`), טבלת ניקוד (`reveal.leaderboard`) והתפלגות (`reveal.distribution`). החשיפה נשארת עד שהמנחה שולחת `POST /next` |
| `FINISHED` | `summary.winners` (3 המנצחים) ו־`summary.leaderboard` |

בנוסף, כשהמשחק מושהה מגיע `paused: true` (בשלבי `QUESTION` ו־`REVEAL`). זה הזמן להציג "מושהה" ולהחליף את כפתור ההשהיה בכפתור "המשך".

### דוגמה: `phase = QUESTION`
```json
{
  "live": {
    "serverTime": "2026-10-23T09:00:12.000Z",
    "game": { "id": 1, "title": "חידון גיאוגרפיה — כיתה ו׳1", "status": "RUNNING" },
    "totalQuestions": 8,
    "participants": [ { "id": 1, "name": "שירה כהן", "connected": true } ],
    "connectedCount": 18,
    "phase": "QUESTION",
    "paused": false,
    "questionNumber": 3,
    "question": { "id": 9, "type": "COMPETITIVE", "text": "...", "options": ["...", "...", "...", "..."] },
    "timeLeftMs": 48000,
    "isLastQuestion": false,
    "answeredCount": 7,
    "lastAnswerId": 52,
    "recentAnswers": [ { "answerId": 52, "participantId": 4, "name": "נועה פרידמן", "receivedAt": "..." } ],
    "fastest": [ { "participantId": 4, "name": "נועה פרידמן", "responseMs": 3214 } ]
  }
}
```

### דוגמה: `phase = REVEAL` (נוסף אובייקט `reveal`)
```json
"reveal": {
  "correctOption": 2,
  "distribution": [3, 12, 2, 1],
  "leaderboard": [
    { "rank": 1, "participantId": 4, "name": "נועה פרידמן", "score": 2930, "correctCount": 3, "totalCorrectMs": 9412 }
  ]
}
```
- `distribution`: כמה בחרו בכל תשובה, לפי הסדר [1, 2, 3, 4].
- בסקר, `correctOption` הוא `null`, וכדאי להציג רק את ההתפלגות.

### דוגמה: `phase = FINISHED`
```json
"summary": {
  "winners": [ { "rank": 1, "name": "נועה פרידמן", "score": 5810, "correctCount": 7 } ],
  "leaderboard": [ /* כל המשתתפים לפי דירוג */ ]
}
```

### איך להקפיץ שם בתחתית המסך (בלי כפילויות)
1. בקריאה הראשונה לשאלה שולחים `/live` בלי `afterAnswerId`.
2. שומרים את `lastAnswerId` מהתשובה.
3. בקריאה הבאה שולחים `?afterAnswerId=<lastAnswerId ששמרת>`.
4. כל מה שמגיע ב־`recentAnswers` הוא **חדש**: מקפיצים כל שם לשנייה אחת.
5. כשמספר השאלה (`questionNumber`) מתחלף, מתחילים מההתחלה.

### טיימר חלק
`timeLeftMs` מגיע כל שנייה. בין רענון לרענון אפשר לספור לאחור בצד הלקוח, ולתקן לפי הערך שחוזר מהשרת. **השרת הוא שקובע:** הזמן והניקוד מחושבים רק בו.

### דברים חשובים
- **השרת מקדם את המשחק בעצמו לפי השעון.** אין צורך לשלוח "עבור לשאלה הבאה". מספיק לרענן.
- **מה שהמשתתף שומע בטלפון** (נכון או שגוי) מגיע מימות המשיח, לא מה־React.
- התשובה הנכונה (`correctOption`) **לא נשלחת** בזמן שאלה, רק בחשיפה. כך אי אפשר לגלות אותה מהדפדפן.

---

## 7. סיכום הרשאות

| פעולה | מנהל | מנחה |
|---|---|---|
| ניהול מנחים | ✅ | ❌ |
| צפייה בכל המשחקים | ✅ | ❌ (רק שלו) |
| יצירה ועריכה של משחקים, שאלות ומשתתפים | ❌ | ✅ (רק שלו) |
| הרצת משחק ו־`/live` | ❌ | ✅ (רק שלו) |
| מחיקת משחק | ✅ (כל משחק) | ✅ (רק שלו, ולא בזמן משחק) |
