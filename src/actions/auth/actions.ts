'use server';

import { API_ROUTES } from '@/constants/api-routes.constant';
import { ErrorObjectSetup } from '@/helpers/error-object-setup';
import { getRequestHeaders } from '../utils/get-request-headers';
import { IAuthTokens, ILogin } from './models/auth.model';

type IAuthActionResult =
	| { result: { data: IAuthTokens }; error?: undefined }
	| { result: null; error: { message: string; statusCode: number } };

export const login = async (data: ILogin): Promise<IAuthActionResult> => {
	const res = await fetch(API_ROUTES.auth.login, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			...(await getRequestHeaders()),
		},
		body: JSON.stringify({
			email: data.email,
			password: data.password,
			fingerprint: data.fingerprint,
		}),
	});

	const errorResult = await ErrorObjectSetup(res);

	if (errorResult?.error) {
		return { result: null, error: errorResult.error };
	}

	const tokens: IAuthTokens = await res.json();

	return { result: { data: tokens } };
};

export const refresh = async (
	refreshToken: string
): Promise<IAuthActionResult> => {
	const res = await fetch(API_ROUTES.auth.refresh, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			...(await getRequestHeaders()),
		},
		body: JSON.stringify({ refreshToken }),
	});

	const errorResult = await ErrorObjectSetup(res);

	if (errorResult?.error) {
		return { result: null, error: errorResult.error };
	}

	const tokens: IAuthTokens = await res.json();

	return { result: { data: tokens } };
};
