import { getPrismaClient } from '$lib/db/prisma';
import type { RequestHandler, RequestEvent } from '@sveltejs/kit';

import bcrypt from 'bcryptjs';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { IS_PRODUCTION, JWT_SECRET } from '$lib/config/backend';
import type { users } from '@prisma/client';
import { loginSchema } from '../lib/types/auth/login';

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
	const body = await request.json();
	const { email, password } = loginSchema.parse(body);
	const prisma = getPrismaClient();
	const user = await prisma.users.findUnique({
		where: {
			email
		}
	});
	if (!user) {
		return {
			status: 403,
			headers: {
				'access-control-allow-origin': '*'
			},
			body: {
				message: 'Invalid email or password'
			}
		};
	}
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		return {
			status: 403,
			headers: {
				'access-control-allow-origin': '*'
			},
			body: {
				message: 'Invalid email or password'
			}
		};
	}
	const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
		expiresIn: '1d'
	});
	return {
		headers: {
			'set-cookie': cookie.serialize('Authorization', token, {
				expires: new Date(Date.now() + 3600 * 24 * 1000),
				maxAge: 60 * 60 * 24,
				httpOnly: true,
				sameSite: 'strict',
				secure: IS_PRODUCTION
			}),
			'access-control-allow-origin': '*'
		},
		body: { ...hideUserData(user) }
	};
};

export const hideUserData = (user: users) => {
	const { password: _, createdAt, updatedAt, ...userInfo } = user;
	return userInfo;
};
