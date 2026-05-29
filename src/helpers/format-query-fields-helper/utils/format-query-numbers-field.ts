import {
	IFormattedRangeField,
	IInclusiveRange,
	IStrictRange,
} from '../types/i-query-field';
import { IRawQueryField } from '../types/i-raw-query-field';

export const formatQueryNumbersFieldInternal = (
	queryItem: Omit<IRawQueryField, 'fieldType' | 'key'>
): IFormattedRangeField => {
	const { value, periodMode } = queryItem;

	const normalizedValue = Array.isArray(value) ? value : [value];

	const resultItems: (IStrictRange | IInclusiveRange)[] = [];

	normalizedValue.forEach((item) => {
		const numberRangeItem = item?.split('_');

		const isValidItem = numberRangeItem?.length > 0;
		const isRange = numberRangeItem?.length === 2;

		if (!isValidItem) {
			return;
		}

		const [startNumber, endNumber] = numberRangeItem;
		const endOrStart = isRange ? endNumber : startNumber;

		if (periodMode === 'STRICT') {
			resultItems.push({ lt: startNumber, gt: endOrStart });
		} else {
			resultItems.push({ lte: startNumber, gte: endOrStart });
		}
	});

	return { value: resultItems.filter(Boolean), mode: 'OR' };
};
