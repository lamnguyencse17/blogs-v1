import { getPrismaClient } from '$lib/db/prisma';
import { CreatePostSchema, type CustomRequestEvent } from '$lib/types/editor';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (event: CustomRequestEvent) => {
	const body = await event.request.json();
	const createPostRequest = CreatePostSchema.parse(body);
	const prisma = getPrismaClient();
	const newBlog = await prisma.blogs.create({
		data: {
			...createPostRequest
		}
	});
	return {
		headers: {
			'access-control-allow-origin': '*'
		},
		body: { ...newBlog }
	};
};
