import { IFormattedBooleanField } from '../types/i-query-field';
import { IRawQueryField } from '../types/i-raw-query-field';

export const formatQueryBooleansFieldInternal = (
	queryItem: Omit<IRawQueryField, 'fieldType' | 'key'>
): IFormattedBooleanField | undefined => {
	const { value } = queryItem;

	return value === 'true' ? true : value === 'false' ? false : undefined;
};
