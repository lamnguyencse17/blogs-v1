import { z } from 'zod';
import type { hideUserData } from '../../../routes/login';

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().trim().min(8)
});
export type LoginSchemaType = z.infer<typeof loginSchema>;

export type LoginResponse = typeof hideUserData;
