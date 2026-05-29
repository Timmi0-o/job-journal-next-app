import {
	TFilterWidgetFilterValue,
	TFilterWidgetFilters,
} from '../types/i-filter-widget-config';

const isActiveValue = (value: TFilterWidgetFilterValue): boolean => {
	if (Array.isArray(value)) return value.length > 0;
	if (typeof value === 'boolean') return value;
	return Boolean(value);
};

export const getActiveFiltersCount = (filters: TFilterWidgetFilters): number => {
	return Object.values(filters).reduce<number>(
		(acc, value) => (isActiveValue(value) ? acc + 1 : acc),
		0
	);
};
