import type { Role } from '@prisma/client';

/** המשתמש המחובר — נקבע רק לפי ה-Token, אף פעם לא לפי מה שהלקוח שולח */
export interface AuthUser {
  id: number;
  role: Role;
  name: string;
  email: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
