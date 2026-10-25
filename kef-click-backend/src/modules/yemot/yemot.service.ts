import { normalizePhone } from '../../utils/phone';
import { handleHangup, handlePhone, type PhoneEvent } from '../gameplay/gameplay.service';
import { combine, hangup, readDigit, say } from './yemot.format';

/** ההודעות שהמשתתף שומע — בעברית פשוטה וניטרלית */
const WAIT = 'ממתינים לשאלה הבאה';
const PRESS = 'להקשת תשובה הקישו 1 עד 4';

export function eventToYemot(event: PhoneEvent): string {
  switch (event.kind) {
    case 'NOT_REGISTERED':
      return combine(say('המספר שלך אינו רשום למשחק פעיל', 'להתראות'), hangup());
    case 'LOBBY':
      return combine(say(`שלום ${event.name}`, `נרשמת למשחק ${event.gameTitle}`, 'המשחק יתחיל בקרוב'), readDigit(WAIT));
    case 'PAUSED':
      return readDigit('המשחק מושהה כרגע');
    case 'QUESTION_OPEN':
      return event.alreadyAnswered
        ? readDigit(`כבר עניתם על שאלה ${event.questionNumber} ${WAIT}`)
        : readDigit(`שאלה ${event.questionNumber} ${PRESS}`);
    case 'REVEAL':
      return readDigit(WAIT);
    case 'FINISHED':
      return combine(
        say('המשחק הסתיים', `צברתם ${event.score} נקודות`, `מקום ${event.rank}`, 'תודה ולהתראות'),
        hangup(),
      );
    case 'ANSWERED': {
      if (event.questionType === 'POLL') return combine(say('התשובה נקלטה'), readDigit(WAIT));
      const feedback = event.isCorrect ? `תשובה נכונה ${event.points} נקודות` : 'תשובה שגויה';
      return combine(say(feedback), readDigit(WAIT));
    }
    case 'ALREADY_ANSWERED':
      return combine(say('כבר עניתם על השאלה הזו'), readDigit(WAIT));
    case 'TOO_LATE':
      return combine(say('הזמן לשאלה הזו הסתיים'), readDigit(WAIT));
    case 'INVALID_KEY':
      return readDigit(PRESS);
    default: {
      const never: never = event;
      return never;
    }
  }
}

/** ימות המשיח עלול לשלוח פרמטר כמה פעמים — לוקחים את האחרון */
function last(value: unknown): string | undefined {
  if (Array.isArray(value)) return last(value[value.length - 1]);
  if (typeof value === 'string') return value;
  return undefined;
}

export interface YemotParams {
  [key: string]: unknown;
}

/**
 * טיפול בפנייה מימות המשיח.
 * @param receivedAt הרגע שבו הבקשה הגיעה לשרת — לפיו נמדד זמן התשובה
 */
export async function handleYemotRequest(params: YemotParams, receivedAt: Date): Promise<string> {
  const rawPhone = last(params.ApiPhone) ?? '';
  const phone = normalizePhone(rawPhone);

  // ניתוק: מסמנים את המשתתף כלא מחובר. (התשובה שנשלחת עם הניתוק לא נספרת)
  if (last(params.hangup) === 'yes') {
    if (phone) await handleHangup(phone);
    return 'noop=hangup';
  }

  if (!phone) return combine(say('לא ניתן לזהות את מספר הטלפון', 'יש להתקשר ממספר גלוי'), hangup());

  const rawAnswer = last(params.answer);
  const digit = rawAnswer && rawAnswer !== 'None' ? rawAnswer.trim() : null;

  const event = await handlePhone(phone, digit, receivedAt);
  return eventToYemot(event);
}
