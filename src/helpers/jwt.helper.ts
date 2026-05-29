export const isJWTExpired = (
	expirationTimestampMiliSeconds: number | null,
	options?: { marginMiliSeconds?: number }
): boolean => {
	if (expirationTimestampMiliSeconds === null) return true;

	const margin = options?.marginMiliSeconds ?? 0;
	const nowMiliSeconds = Date.now();
	const nowMillisecWithMargin = nowMiliSeconds + margin;

	return expirationTimestampMiliSeconds <= nowMillisecWithMargin;
};

export interface IAccessTokenPayload {
	exp: number;
	iat: number;
	sub: string;
	systemRole: string;
	status: string;
	orgId: string | null;
	roleId: string | null;
}

export function parseJwt(token: null | string): IAccessTokenPayload | null {
	if (!token) return null;

	try {
		const [, payload] = token.split('.');
		return JSON.parse(
			Buffer.from(payload, 'base64').toString('utf-8')
		) as IAccessTokenPayload;
	} catch {
		return null;
	}
}
