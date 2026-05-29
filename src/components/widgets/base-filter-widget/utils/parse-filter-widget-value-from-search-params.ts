import { QUERY_ARRAY_SEPARATOR } from '@/constants/query-array-separator';
import {
	IFilterWidgetItem,
	TFilterWidgetFilterValue,
} from '../types/i-filter-widget-config';

export const parseFilterWidgetValueFromSearchParams = (
	filter: IFilterWidgetItem,
	searchParams: URLSearchParams
): TFilterWidgetFilterValue => {
	const raw = searchParams.get(filter.key);

	if (raw === null) {
		return null;
	}

	if (filter.type === 'INPUT') {
		return raw;
	}

	if (filter.type === 'CHECKBOX') {
		return raw === 'true';
	}

	if (filter.selectionMode === 'multiple') {
		return raw.split(QUERY_ARRAY_SEPARATOR);
	}

	return raw;
};
