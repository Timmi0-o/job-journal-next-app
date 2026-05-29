import { IFormattedDateRangeFilterField } from '../types/i-query-field';
import { IRawQueryField } from '../types/i-raw-query-field';

const normalizeDateToFrom = (date: string): string => {
	if (date.includes('T')) {
		return date;
	}

	return `${date}T00:00:00.000Z`;
};

const normalizeDateToTo = (date: string): string => {
	if (date.includes('T')) {
		return date;
	}

	return `${date}T23:59:59.999Z`;
};

const parseDateRangeFromUrlValue = (
	value: string
): IFormattedDateRangeFilterField['value'] | null => {
	const parts = value.split('_').filter(Boolean);

	if (parts.length === 0) {
		return null;
	}

	if (parts.length === 1) {
		const [date] = parts;

		return {
			from: normalizeDateToFrom(date),
			to: normalizeDateToTo(date),
		};
	}

	const [from, to] = parts;

	return {
		from: normalizeDateToFrom(from),
		to: normalizeDateToTo(to),
	};
};

export const formatQueryDatesFieldInternal = (
	queryItem: Omit<IRawQueryField, 'fieldType' | 'key'>
): IFormattedDateRangeFilterField => {
	const { value } = queryItem;
	const normalizedValue = Array.isArray(value) ? value : [value];

	for (const item of normalizedValue) {
		if (typeof item !== 'string' || !item.trim()) {
			continue;
		}

		const parsed = parseDateRangeFromUrlValue(item.trim());

		if (parsed?.from || parsed?.to) {
			return { value: parsed };
		}
	}

	return { value: {} };
};

export const hasFormattedDateRangeValue = (
	result: IFormattedDateRangeFilterField
): boolean => Boolean(result.value.from || result.value.to);
