/**
 * שגיאה עם קוד HTTP. כל מקום בשרת יכול לזרוק אותה,
 * ו-errorHandler יהפוך אותה לתשובת JSON מסודרת.
 */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }

  static badRequest(message: string, details?: unknown) {
    return new HttpError(400, 'BAD_REQUEST', message, details);
  }
  static unauthorized(message = 'נדרשת התחברות') {
    return new HttpError(401, 'UNAUTHORIZED', message);
  }
  static forbidden(message = 'אין לך הרשאה לפעולה זו') {
    return new HttpError(403, 'FORBIDDEN', message);
  }
  static notFound(message = 'לא נמצא') {
    return new HttpError(404, 'NOT_FOUND', message);
  }
  static conflict(message: string, details?: unknown) {
    return new HttpError(409, 'CONFLICT', message, details);
  }
}
