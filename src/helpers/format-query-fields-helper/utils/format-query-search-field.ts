import { ISearchField } from '../types/i-query-field';
import { IRawQueryField } from '../types/i-raw-query-field';

export const formatQuerySearchFieldInternal = (
	queryItem: Omit<IRawQueryField, 'fieldType' | 'key'>
): ISearchField => {
	const { value, mode } = queryItem;

	if (typeof value !== 'string') {
		return undefined;
	}

	return {
		value,
		mode: (mode as 'PARTIAL' | 'STRICT' | undefined) ?? 'PARTIAL',
	};
};
