import { getRequestHeaders } from '@/actions/utils/get-request-headers';
import { auth } from '@/configs/auth/auth';

export interface INextFetchRequestConfig {
	revalidate?: number | false;
	tags?: string[];
}

export interface IHttpParams<
	T extends BodyInit | null | undefined | unknown = unknown,
> {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	headers?: Record<string, string>;
	body?: T;
	cache?: RequestCache;
	next?: INextFetchRequestConfig;
}

export interface IApiParams<T extends BodyInit | null | undefined = BodyInit> {
	url: string;
	params: IHttpParams<T>;
	json?: boolean;
	isPublic?: boolean;
}

export const api = async <T extends BodyInit | null | undefined = BodyInit>({
	url,
	params,
	json = true,
	isPublic = false,
}: IApiParams<T>): Promise<Response> => {
	const session = await auth();

	let opts: RequestInit;

	if (json) {
		const stringifiedBody = params.body
			? JSON.stringify(params.body)
			: undefined;

		opts = {
			method: params.method,
			...(stringifiedBody ? { body: stringifiedBody } : {}),
			cache: params.cache,
			next: params.next,
			headers: {
				Authorization: 'Bearer ' + session?.accessToken,
				...(params.headers || {}),
				...(params.body ? { 'Content-Type': 'application/json' } : {}),
				...(await getRequestHeaders()),
			},
		};
	} else {
		opts = {
			method: params.method,
			body: params.body as BodyInit,
			cache: params.cache,
			next: params.next,
			headers: {
				Authorization: 'Bearer ' + session?.accessToken,
				...(params.headers || {}),
				...(await getRequestHeaders()),
			},
		};
	}

	if (isPublic && opts.headers) {
		delete (opts.headers as Record<string, string>).Authorization;
	}

	return fetch(url, opts);
};
