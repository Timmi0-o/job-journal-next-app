import { PUBLIC_ROUTES } from '@/constants/public-routes';
import { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export const authGuard = (
	req: NextRequest & { auth?: Session | null }
): NextResponse | undefined => {
	const { nextUrl } = req;
	const pathname = nextUrl.pathname;

	const isAuthenticated = Boolean(req.auth);
	const isAuthRoute = isPublicAuthPath(pathname);

	if (!isAuthenticated && !isAuthRoute) {
		return NextResponse.redirect(new URL('/login', nextUrl.origin));
	}

	if (isAuthenticated && isAuthRoute) {
		return NextResponse.redirect(new URL('/', nextUrl.origin));
	}
};

const isPublicAuthPath = (pathname: string): boolean => {
	return PUBLIC_ROUTES.some(
		(path) => pathname === path || pathname.startsWith(`${path}/`)
	);
};
