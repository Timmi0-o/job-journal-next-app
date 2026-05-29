import type { Session } from 'next-auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from './configs/auth/auth';
import { authGuard } from './helpers/app-proxy/auth-guard';
import { forbiddenGuard } from './helpers/app-proxy/forbidden-guard';

const proxyImpl = async (
	req: NextRequest & { auth?: Session | null }
): Promise<NextResponse> => {
	const authResponse = authGuard(req);

	if (authResponse) {
		return authResponse;
	}

	const forbiddenResponse = forbiddenGuard(req);

	if (forbiddenResponse) {
		return forbiddenResponse;
	}

	return NextResponse.next();
};

export default auth(proxyImpl);

export const config = {
	matcher: [
		'/((?!api/auth|_next/static|_next/image|favicon.ico|images|icons|.*\\..*).*)',
	],
};
