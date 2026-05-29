import { IFormattedRequiredIdsField } from '../types/i-query-field';
import { IRawQueryField } from '../types/i-raw-query-field';

const splitUnderscoreIds = (raw: string): string[] => {
	return raw
		.split('_')
		.map((id) => id.trim())
		.filter(Boolean);
};

export const formatQueryRequiredIdsFieldInternal = (
	queryItem: Omit<IRawQueryField, 'fieldType' | 'key'>
): IFormattedRequiredIdsField => {
	const { value } = queryItem;

	if (Array.isArray(value)) {
		return value
			.filter((item): item is string => typeof item === 'string')
			.flatMap((item) => splitUnderscoreIds(item));
	}

	if (typeof value !== 'string') {
		return [];
	}

	return splitUnderscoreIds(value);
};
