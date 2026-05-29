import { formatQueryFields } from '@/helpers/format-query-fields-helper';
import { IQueryObject } from '@/types/i-query-object';
import { IQueryFilterItemsConfig } from './types/i-query-filter-items-config';

const FILTER_ITEMS_CONFIG: IQueryFilterItemsConfig = {
	id: { fieldType: 'STRING' },
	email: { fieldType: 'STRING' },
	phone: { fieldType: 'STRING' },
	status: { fieldType: 'STRING' },
	role: { fieldType: 'STRING' },
	search: { fieldType: 'SEARCH' },
	limit: { fieldType: 'LIMIT' },
	page: { fieldType: 'PAGE' },
};

export function formatQueryGetUsers(
	searchParams: Record<string, string>
): IQueryObject {
	return formatQueryFields({
		queryItems: Object.entries(FILTER_ITEMS_CONFIG).map(([key, config]) => ({
			...config,
			value: searchParams[key],
			key: config.renameKey ?? key,
		})),
	});
}
