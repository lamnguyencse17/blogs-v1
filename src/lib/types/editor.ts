import type { RequestEvent } from '@sveltejs/kit';
import { z } from 'zod';

export interface CustomRequestEvent extends Omit<RequestEvent, 'locals'> {
	locals: CustomLocals;
}

export interface CustomLocals extends App.Locals {
	user?: {
		name: string;
		id: string;
		email: string;
	};
}

export const CreatePostSchema = z.object({
	creatorId: z.string(),
	title: z.string().min(8),
	subTitle: z.string().min(8),
	content: z.string()
});
