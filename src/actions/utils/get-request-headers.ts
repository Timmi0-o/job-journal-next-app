import { headers } from 'next/headers';

export const getRequestHeaders = async (): Promise<Record<string, string>> => {
	const headersList = await headers();
	const host =
		headersList.get('host') || headersList.get('x-forwarded-host') || '';
	const protocol = headersList.get('x-forwarded-proto') || 'http';
	const origin = headersList.get('origin') || `${protocol}://${host}`;

	return {
		host,
		origin,
		'x-forwarded-host': host,
		'x-forwarded-proto': protocol,
	};
};
