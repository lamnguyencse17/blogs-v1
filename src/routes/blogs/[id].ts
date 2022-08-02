import { getPrismaClient } from '$lib/db/prisma';
import type { Prisma } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';

const getBlog = async (id: string) => {
	const prismaClient = getPrismaClient();
	const blog = await prismaClient.blogs.findUnique({
		where: {
			id
		}
	});
	return blog;
};

export type SingleBlog = Awaited<Prisma.PromiseReturnType<typeof getBlog>>;

export async function GET({ params }: RequestEvent) {
	const { id } = params;
	const blog = await getBlog(id);
	return {
		status: 200,
		headers: {
			'access-control-allow-origin': '*'
		},
		body: {
			blogResponse: blog
		}
	};
}
