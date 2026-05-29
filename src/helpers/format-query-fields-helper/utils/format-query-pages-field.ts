import { isNumberTest } from '@/utils/is-number-test.util';
import { IPaginationField } from '../types/i-query-field';
import { IRawQueryField } from '../types/i-raw-query-field';

export const formatQueryPagesFieldInternal = (
	queryItem: Omit<IRawQueryField, 'fieldType' | 'key'>
): IPaginationField => {
	const { value } = queryItem;

	if (!isNumberTest(value)) {
		return 1;
	}

	return Number(value);
};
