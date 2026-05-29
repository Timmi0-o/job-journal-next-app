import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface Session {
		accessToken: string;
		refreshToken: string;
		exp: number;
		user: {
			id: string;
			email: string;
			role?: string;
			status?: string;
		} & DefaultSession['user'];
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface User {
		email: string;
		accessToken: string;
		refreshToken: string;
		exp: number;
		userId: string;
		role: string;
		status: string;
	}
}

declare module 'next-auth/jwt' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface JWT {
		accessToken?: string;
		refreshToken?: string;
		accessTokenExpires?: number;
		userId?: string;
		role?: string;
		status?: string;
	}
}
