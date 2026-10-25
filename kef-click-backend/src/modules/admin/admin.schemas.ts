import { z } from 'zod';
import { passwordSchema as password } from '../auth/auth.schemas';
import { gameListQuerySchema } from '../games/games.schemas';

export const createHostSchema = z.object({
  name: z.string({ required_error: 'שם חובה' }).trim().min(2, 'שם קצר מדי').max(80, 'שם ארוך מדי'),
  email: z.string({ required_error: 'אימייל חובה' }).trim().toLowerCase().email('אימייל לא תקין').max(120),
  password,
});

export const updateHostSchema = z
  .object({
    name: z.string().trim().min(2, 'שם קצר מדי').max(80, 'שם ארוך מדי').optional(),
    email: z.string().trim().toLowerCase().email('אימייל לא תקין').max(120).optional(),
    password: password.optional(),
    isBlocked: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'יש לשלוח לפחות שדה אחד לעדכון' });

export const hostListQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  blocked: z.enum(['true', 'false']).optional(),
});

export const adminGameListQuerySchema = gameListQuerySchema.extend({
  hostId: z.coerce.number().int().positive().optional(),
});

export type CreateHostInput = z.infer<typeof createHostSchema>;
export type UpdateHostInput = z.infer<typeof updateHostSchema>;
export type HostListQuery = z.infer<typeof hostListQuerySchema>;
