import { parseDate } from '@internationalized/date';
import type { DateValue } from 'react-aria-components';

export const parseFilterDateValue = (value: string | null): DateValue | null => {
	if (!value) {
		return null;
	}

	try {
		return parseDate(value);
	} catch {
		return null;
	}
};

export const formatFilterDateValue = (value: DateValue | null): string | null => {
	if (!value) {
		return null;
	}

	return value.toString();
};
