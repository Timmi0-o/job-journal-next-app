import { TFilterWidgetFilters } from '../types/i-filter-widget-config';

export const cloneFilters = <T extends TFilterWidgetFilters>(filters: T): T => {
	return Object.fromEntries(
		Object.entries(filters).map(([key, value]) => {
			if (Array.isArray(value)) {
				return [key, [...value]];
			}

			return [key, value];
		})
	) as T;
};
