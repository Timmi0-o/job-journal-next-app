'use client';

import { Input } from '@/components/shared/ui/input/input';
import { FILTER_WIDGET_STORE_KEY } from '@/components/widgets/base-filter-widget/config/filter-widget-store-key';
import {
	BaseFilterWidgetStore,
	hydrateBaseFilterWidgetStoreFromSearchParams,
} from '@/components/widgets/base-filter-widget/store/base-filter-widget/base-filter-widget.store';
import { useManageSearchParams } from '@/hooks/use-manage-search-params';
import { observer } from 'mobx-react-lite';
import { FILTER_WIDGET_NAME } from './data/filter-widget-name';
import { useGetFilterConfig } from './hooks/use-get-filter-config';
import { IJobVariantFilters } from './types/i-job-variant-filters-type';

export const FilterBlock = observer(() => {
	const filterConfig = useGetFilterConfig();

	const { handlePushKeyInSearchParams, searchParams } = useManageSearchParams();

	hydrateBaseFilterWidgetStoreFromSearchParams(
		FILTER_WIDGET_STORE_KEY(FILTER_WIDGET_NAME),
		filterConfig,
		searchParams
	);

	const { filters, setFilters } = BaseFilterWidgetStore<IJobVariantFilters>(
		FILTER_WIDGET_STORE_KEY(FILTER_WIDGET_NAME)
	);

	return (
		<div className="flex items-center gap-3 flex-1 flex-wrap">
			<Input
				isClearable
				onSubmit={(value?: string) =>
					handlePushKeyInSearchParams({
						key: 'search',
						value: value ?? filters.search,
					})
				}
				value={filters.search ?? ''}
				onChange={(e) => setFilters({ ...filters, search: e.target.value })}
				placeholder="Поиск..."
				className="min-w-[200px] sm:min-w-[240px] lg:min-w-[360px] max-w-[580px] w-full sm:w-auto flex-1 sm:flex-initial"
			/>
		</div>
	);
});
