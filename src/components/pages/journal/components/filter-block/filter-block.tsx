'use client';

import { BaseFilterWidget } from '@/components/widgets/base-filter-widget/base-filter-widget';
import { observer } from 'mobx-react-lite';
import { FILTER_WIDGET_NAME } from './data/filter-widget-name';
import { useGetFilterConfig } from './hooks/use-get-filter-config';

export const FilterBlock = observer(() => {
	const filterConfig = useGetFilterConfig();

	return (
		<div className="flex items-center gap-3 flex-1 flex-wrap">
			<BaseFilterWidget filtersConfig={filterConfig} name={FILTER_WIDGET_NAME} />
		</div>
	);
});
