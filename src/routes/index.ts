import { getPrismaClient } from '$lib/db/prisma';
import type { Prisma } from '@prisma/client';

const getIndexBlogs = async () => {
	const prismaClient = getPrismaClient();
	const blogs = await prismaClient.blogs.findMany({
		select: {
			id: true,
			title: true,
			subTitle: true,
			updatedAt: true
		}
	});
	return blogs;
};

export type IndexBlogs = Awaited<Prisma.PromiseReturnType<typeof getIndexBlogs>>;

export async function GET() {
	const blogs = await getIndexBlogs();
	return {
		status: 200,
		headers: {
			'access-control-allow-origin': '*'
		},
		body: { blogs }
	};
}
