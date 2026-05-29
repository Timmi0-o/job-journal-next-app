import { EMPTY_DEFAULT_API_RESPONSE } from '@/constants/empty-default-api-response';
import {
	type IActionResponse,
	type IGetActionOptions,
	type IMutateActionOptions,
} from '@/types/i-action.types';
import { hardLogout } from '@/utils/hard-logout';
import { api, IHttpParams } from './api.helper';
import { baseQueryFormatter } from './base-query-formatter';
import { ErrorObjectSetup } from './error-object-setup';

export const abstractGetAction = async <T = unknown>({
	url,
	params = { method: 'GET' },
	filters,
	customFormatter,
	isArray = false,
	preset,
}: IGetActionOptions): Promise<IActionResponse<T>> => {
	let finalUrl = url;

	if (filters) {
		const formattedParams = customFormatter
			? customFormatter(filters)
			: await baseQueryFormatter(filters);

		if (formattedParams && Object.keys(formattedParams).length > 0) {
			finalUrl += `?${new URLSearchParams(formattedParams)}`;
		}
	}

	if (preset) {
		finalUrl += (finalUrl.includes('?') ? '&' : '?') + `preset=${preset}`;
	}

	const res = await api({
		url: finalUrl,
		params: params as IHttpParams<BodyInit | null | undefined>,
	});

	const errorResult = await ErrorObjectSetup(res);

	if (errorResult?.error) {
		if (errorResult.error.statusCode === 404 && isArray) {
			return EMPTY_DEFAULT_API_RESPONSE as unknown as IActionResponse<T>;
		}
		return errorResult as unknown as IActionResponse<T>;
	}

	const data = await res.json();

	if (!data?.result) {
		return {
			...data,
			result: {
				data: data?.data ?? data,
				meta: data?.meta,
				success: true,
			},
		} as IActionResponse<T>;
	}

	if (Array.isArray(data.result)) {
		return {
			...data,
			result: {
				data: data.result,
				meta: {
					total: data.result.length,
					totalCount: data.result.length,
					limit: data.result.length,
					page: 1,
				},
				success: true,
			},
		} as IActionResponse<T>;
	}

	return data as IActionResponse<T>;
};

export const abstractMutateAction = async <TBody, TResult = unknown>({
	url,
	params = { method: 'POST', body: undefined as TBody },
	json = true,
	isForbiddenLogout = false,
	isPublic = false,
	onOk,
}: IMutateActionOptions<TBody>): Promise<IActionResponse<TResult>> => {
	const res = await api({
		url,
		params: params as IHttpParams<BodyInit | null | undefined>,
		json,
		isPublic,
	});

	const errorResult = await ErrorObjectSetup(res);

	if (isForbiddenLogout) {
		await hardLogout();
	}

	if (errorResult?.error) {
		return errorResult as unknown as IActionResponse<TResult>;
	}

	await onOk?.();

	const data = await res.json();

	return { result: { data, success: true } } as IActionResponse<TResult>;
};
