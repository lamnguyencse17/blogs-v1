import cookie from 'cookie';
export const GET = () => {
	return {
		status: 200,
		headers: {
			'set-cookie': cookie.serialize('Authorization', '', {
				expires: new Date(Date.now() + 3600 * 24 * 1000),
				maxAge: -60 * 60 * 24,
				httpOnly: true,
				sameSite: 'strict'
			}),
			'access-control-allow-origin': '*'
		},
		body: {}
	};
};
