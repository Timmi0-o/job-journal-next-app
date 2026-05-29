import {
	IFilterWidgetConfig,
	TFilterWidgetFilters,
} from '../types/i-filter-widget-config';
import { parseFilterWidgetValueFromSearchParams } from './parse-filter-widget-value-from-search-params';

export const buildFiltersFromSearchParams = (
	filtersConfig: IFilterWidgetConfig,
	searchParams: URLSearchParams
): TFilterWidgetFilters => {
	const filters: TFilterWidgetFilters = {};

	filtersConfig.filters.forEach((filter) => {
		filters[filter.key] = parseFilterWidgetValueFromSearchParams(
			filter,
			searchParams
		);
	});

	return filters;
};
