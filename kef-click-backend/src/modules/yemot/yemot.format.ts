/**
 * בניית תשובות בפורמט של מודול API בימות המשיח.
 *
 * ימות המשיח מצפה לטקסט פשוט (לא JSON) עם פקודות כמו:
 *   id_list_message=t-טקסט להקראה
 *   read=t-טקסט=שם_פרמטר,הגדרות...
 *   go_to_folder=hangup
 * כמה פקודות מחוברות ב-&.
 *
 * כל הפורמט מרוכז בקובץ הזה, כך שאם ימות המשיח ישנו משהו — מתקנים רק כאן.
 */
import { GAME_RULES } from '../../config/game';

/** שם הפרמטר שבו ימות המשיח יחזיר לנו את המקש שהוקש */
export const ANSWER_PARAM = 'answer';

/**
 * ניקוי טקסט להקראה: תווים כמו . , - & = " ' | יש להם משמעות מיוחדת
 * בפורמט של ימות המשיח, ולכן מחליפים אותם ברווח.
 */
export function cleanTts(text: string): string {
  return text
    .replace(/[.,\-&=|"'`\n\r\t*#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** חלק הודעה אחד או כמה חלקים — מחוברים בנקודה (הפרדה בין קטעי השמעה) */
function messageParts(parts: string[]): string {
  return parts
    .map(cleanTts)
    .filter(Boolean)
    .map((p) => `t-${p}`)
    .join('.');
}

/** השמעת הודעה */
export function say(...parts: string[]): string {
  return `id_list_message=${messageParts(parts)}`;
}

/**
 * בקשה להקשת מקש אחד (1 עד 4), ואז ימות המשיח פונה שוב לשרת עם answer=<המקש>.
 * אם לא הוקש כלום בזמן ההמתנה — נשלח answer=None והשרת פשוט מבקש שוב.
 *
 * סדר השדות (לפי תיעוד מודול API של ימות המשיח):
 *  שם פרמטר, להשתמש בקיים, מקסימום ספרות, מינימום ספרות, שניות המתנה, סוג השמעה,
 *  חסימת כוכבית, חסימת אפס, החלפת תו, מקשים מותרים, ניסיונות ריקים, אישור ריק,
 *  ערך ריק, נעילת מקלדת, אישור הקשה
 */
export function readDigit(prompt: string): string {
  const fields = [
    ANSWER_PARAM, // שם הפרמטר
    'no', // לא להשתמש בערך קודם — לשאול כל פעם מחדש
    '1', // מקסימום ספרות
    '1', // מינימום ספרות
    String(GAME_RULES.PHONE_WAIT_SECONDS), // שניות המתנה
    'No', // לא להקריא את מה שהוקש
    'yes', // חסימת כוכבית
    'yes', // חסימת אפס
    '', // בלי החלפת תווים
    '1234', // מקשים מותרים
    '1', // ניסיון אחד לפני ערך ריק
    'Ok', // ערך ריק מותר — ממשיכים
    'None', // הערך שנשלח כשלא הוקש כלום
    '', // נעילת מקלדת — לא רלוונטי
    'no', // בלי שלב "לאישור הקישו 1"
  ];
  return `read=${messageParts([prompt])}=${fields.join(',')}`;
}

/** ניתוק השיחה */
export function hangup(): string {
  return 'go_to_folder=hangup';
}

/** חיבור כמה פקודות לתשובה אחת */
export function combine(...commands: string[]): string {
  return commands.filter(Boolean).join('&');
}
