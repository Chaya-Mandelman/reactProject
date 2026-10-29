/** קבועי המשחק — כל הכללים שסוכמו באפיון במקום אחד */
export const GAME_RULES = {
  /** זמן מענה לכל שאלה */
  QUESTION_TIME_MS: 60_000,
  /** ניקוד מקסימלי לתשובה נכונה (מתחת לשנייה) */
  MAX_POINTS: 1000,
  /** כמה נקודות יורדות בכל שנייה שלמה */
  POINTS_LOST_PER_SECOND: 10,
  /** כמה "מהירים ביותר" מוצגים בצד המסך */
  FASTEST_COUNT: 5,
  /** כמה מנצחים בסיכום */
  WINNERS_COUNT: 3,
  /** כמה זמן (שניות) ימות המשיח מחכה להקשה לפני שהוא שואל שוב */
  PHONE_WAIT_SECONDS: 60,
} as const;

/**
 * חישוב ניקוד לתשובה נכונה: כל שנייה שלמה מורידה 10 נקודות.
 * 0–0.999 שניות = 1000, שנייה 1 = 990, ... שנייה 59 = 410.
 */
export function pointsForCorrect(responseMs: number): number {
  const seconds = Math.floor(Math.max(0, responseMs) / 1000);
  const maxSeconds = Math.floor(GAME_RULES.QUESTION_TIME_MS / 1000) - 1;
  const s = Math.min(seconds, maxSeconds);
  return GAME_RULES.MAX_POINTS - s * GAME_RULES.POINTS_LOST_PER_SECOND;
}
