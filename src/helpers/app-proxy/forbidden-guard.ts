import { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import {
	getRequiredRolesForPath,
	hasUserRole,
} from '../proxy-route-permissions.helper';

const FORBIDDEN_ROUTE = '/forbidden';
const FORBIDDEN_ACCESS_COOKIE = 'deniedFrom';

export const forbiddenGuard = (
	req: NextRequest & { auth?: Session | null }
): NextResponse | undefined => {
	const { nextUrl } = req;
	const pathname = nextUrl.pathname;
	const session = req.auth;

	if (pathname === FORBIDDEN_ROUTE) {
		const deniedFrom = req.cookies.get(FORBIDDEN_ACCESS_COOKIE)?.value;

		if (!deniedFrom) {
			return NextResponse.redirect(new URL('/', nextUrl.origin));
		}

		const response = NextResponse.next();
		clearForbiddenAccessCookie(response);

		return response;
	}

	const requiredRoles = getRequiredRolesForPath(pathname);

	const isAccessDenied =
		Boolean(requiredRoles) &&
		!hasUserRole(session?.user?.role, requiredRoles!);

	if (isAccessDenied) {
		return buildForbiddenRedirectResponse(nextUrl.origin, pathname);
	}
};

const clearForbiddenAccessCookie = (response: NextResponse): void => {
	response.cookies.set(FORBIDDEN_ACCESS_COOKIE, '', {
		maxAge: 0,
		path: '/',
	});
};

const buildForbiddenRedirectResponse = (
	origin: string,
	deniedPathname: string
): NextResponse => {
	const response = NextResponse.redirect(new URL(FORBIDDEN_ROUTE, origin));

	response.cookies.set(FORBIDDEN_ACCESS_COOKIE, deniedPathname, {
		maxAge: 60,
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
	});

	return response;
};
