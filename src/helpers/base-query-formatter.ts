import { IGetActionPresets } from '@/types/i-action.types';
import { IQueryObject } from '@/types/i-query-object';

export const baseQueryFormatter = async (
	filters: IQueryObject
): Promise<Record<string, string> | undefined> => {
	if (!filters) {
		return undefined;
	}

	const params: Record<string, string> = {};

	for (const [key, value] of Object.entries(filters)) {
		switch (key) {
			case 'limit':
				params.limit = String(value);
				break;
			case 'page':
				params.page = String(value);
				break;
			case 'search':
				params.search =
					typeof value === 'object' ? JSON.stringify(value) : String(value);
				break;
			case 'orderBy':
				params.orderBy = JSON.stringify(value);
				break;
			case 'preset':
				params.preset = value as IGetActionPresets;
				break;
			default:
				params[key] = JSON.stringify(value);
				break;
		}
	}

	return Object.keys(params).length > 0 ? params : undefined;
};
