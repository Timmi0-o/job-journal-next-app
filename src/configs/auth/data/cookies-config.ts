const cookieName =
	process.env.AUTH_COOKIE_NAME ?? 'job-journal.next-auth.session-token';

export const COOKIES_CONFIG = {
	sessionToken: {
		name: cookieName,
		options: {
			httpOnly: true,
			sameSite: 'lax' as const,
			path: '/',
			secure: process.env.NODE_ENV === 'production',
		},
	},
};
