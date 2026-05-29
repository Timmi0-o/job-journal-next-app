import { COMMON_ERROR_TRANSLATES } from '@/constants/common-error-translates';
import { IActionError } from '@/types/i-action.types';
import { createLogger } from '@/utils/logger.util';

const apiLog = createLogger('API');

/**
 * Формат ошибки backend (job-journal-nest-app):
 * { statusCode, error: { code, message, details? }, timestamp, path, correlationId? }
 */
interface IBackendError {
	statusCode: number;
	error?: { code?: string; message?: string };
	message?: string;
	timestamp?: string;
	path?: string;
}

export const ErrorObjectSetup = async (
	res: Response
): Promise<{ result: null; error: IActionError; isArray: boolean } | undefined> => {
	if (res.ok) {
		return undefined;
	}

	let errorData: IActionError;

	try {
		const errorResponse: IBackendError = await res.json();

		const rawMessage =
			errorResponse?.error?.message ?? errorResponse?.message ?? '';

		const shortDescription = rawMessage
			? `API: ${String(rawMessage)
					.split(',')
					.map((item) => item.trim())
					.join(', ')}`
			: '';

		const errorMessage = shortDescription.trim();

		apiLog.error(errorMessage || 'Неизвестная ошибка запроса');

		errorData = {
			statusCode: errorResponse.statusCode ?? res.status,
			timestamp: errorResponse.timestamp || new Date().toISOString(),
			message: errorMessage
				? ERROR_MESSAGE_FORMATTER(errorMessage)
				: `Ошибка запроса (${res.status})`,
			error: errorResponse.error?.code || res.statusText || 'Unknown Error',
		};
	} catch {
		errorData = {
			statusCode: res.status,
			timestamp: new Date().toISOString(),
			message: `Ошибка запроса (${res.status})`,
			error: res.statusText || 'Unknown Error',
		};
	}

	return { result: null, error: errorData, isArray: false };
};

const ERROR_MESSAGE_FORMATTER = (error: string): string => {
	const errorKeys = Object.keys(COMMON_ERROR_TRANSLATES);
	const errorKey = errorKeys.find((key) => error.includes(key));
	return errorKey ? COMMON_ERROR_TRANSLATES[errorKey] : error;
};
