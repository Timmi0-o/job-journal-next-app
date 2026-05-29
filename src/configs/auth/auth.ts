import { login, refresh } from '@/actions/auth/actions';
import { isJWTExpired, parseJwt } from '@/helpers/jwt.helper';
import type { NextAuthConfig, Session, User } from 'next-auth';
import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';
import { authLog } from './auth-logger';
import { COOKIES_CONFIG } from './data/cookies-config';

const MILLISEC = 1000;
const REFRESH_MARGIN_MS = 60_000;

const config = {
	session: { strategy: 'jwt' },
	trustHost: true,
	cookies: COOKIES_CONFIG,
	providers: [
		Credentials({
			id: 'baseCredentials',
			name: 'baseCredentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			authorize: async (credentials): Promise<User | null> => {
				try {
					if (!credentials?.email || !credentials?.password) {
						throw new Error('no credentials to log in');
					}

					const loginData = await login({
						email: credentials.email as string,
						password: credentials.password as string,
					});

					const accessToken = loginData.result?.data?.accessToken;
					const refreshToken = loginData.result?.data?.refreshToken;

					if (!accessToken || !refreshToken) {
						return null;
					}

					const tokenPayload = parseJwt(accessToken);

					if (!tokenPayload) {
						return null;
					}

					authLog.success(`Login: ${credentials.email}`);

					return {
						email: credentials.email as string,
						accessToken,
						refreshToken,
						exp: tokenPayload.exp * MILLISEC,
						userId: tokenPayload.sub.toString(),
						role: tokenPayload.systemRole,
						status: tokenPayload.status,
					};
				} catch (err) {
					authLog.error(err);
					return null;
				}
			},
		}),
	],
	secret: process.env.AUTH_SECRET,
	pages: {
		signIn: '/login',
		error: '/login',
	},
	events: {
		signOut: (message) => {
			const token = 'token' in message ? message.token : null;
			const email = (token as { email?: string } | null)?.email ?? 'unknown';
			authLog.success(`Logout: ${email}`);
		},
	},
	callbacks: {
		jwt: async ({ token, account, user }): Promise<JWT | null> => {
			if (account && user) {
				return {
					...token,
					accessToken: user.accessToken,
					refreshToken: user.refreshToken,
					accessTokenExpires: user.exp,
					userId: user.userId,
					role: user.role,
					status: user.status,
				};
			}

			const isTokenExpired = isJWTExpired(token.accessTokenExpires ?? null, {
				marginMiliSeconds: REFRESH_MARGIN_MS,
			});

			if (!isTokenExpired) {
				return token;
			}

			if (!token.refreshToken) {
				return null;
			}

			authLog.warn('Token expired, attempting refresh');

			try {
				const refreshed = await refresh(token.refreshToken);

				const accessToken = refreshed.result?.data?.accessToken;
				const refreshToken = refreshed.result?.data?.refreshToken;

				if (!accessToken || !refreshToken) {
					return null;
				}

				const decoded = parseJwt(accessToken);

				if (!decoded?.exp) {
					return null;
				}

				authLog.success('Token refreshed successfully');

				return {
					...token,
					accessToken,
					refreshToken,
					accessTokenExpires: decoded.exp * MILLISEC,
					role: decoded.systemRole,
					status: decoded.status,
				};
			} catch (e) {
				authLog.error(e);
				return null;
			}
		},
		session: ({ session, token }): Session => {
			session.accessToken = token.accessToken as string;
			session.refreshToken = token.refreshToken as string;
			session.exp = token.accessTokenExpires as number;
			session.user = {
				...session.user,
				id: token.userId as string,
				email: session.user?.email as string,
				role: token.role ?? '',
				status: token.status ?? '',
			};

			return session;
		},
	},
	debug: false,
} satisfies NextAuthConfig;

const res = NextAuth(config);

export const handlers = res.handlers;
export const signIn = res.signIn;
export const signOut = res.signOut;
export const auth = res.auth;
