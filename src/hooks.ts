import type { HiddenUserData } from '$lib/types/auth/login';
import type { GetSession, Handle, RequestEvent } from '@sveltejs/kit';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$lib/config/backend';

const verifyToken = (token: string) => {
	const payload = jwt.verify(token, JWT_SECRET);
	return payload as HiddenUserData;
};

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	event.locals.userid = cookies['userid'] || crypto.randomUUID();
	const response = await resolve(event);

	if (!cookies['userid']) {
		// if this is the first time the user has visited this app,
		// set a cookie so that we recognise them when they return
		response.headers.set(
			'set-cookie',
			cookie.serialize('userid', event.locals.userid, {
				path: '/',
				httpOnly: true
			})
		);
	}

	return response;
};

export const getSession: GetSession = (event: RequestEvent) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	if (!cookies['Authorization']) {
		return {
			user: {
				email: '',
				id: '',
				name: ''
			}
		};
	}
	const { email, id, name } = verifyToken(cookies['Authorization']);
	return {
		user: { email, id, name }
	};
};
