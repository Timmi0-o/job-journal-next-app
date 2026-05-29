import { IFilterWidgetConfig } from '@/components/widgets/base-filter-widget/types/i-filter-widget-config';

export const useGetFilterConfig = (): IFilterWidgetConfig => {
	return {
		filters: [
			{
				type: 'INPUT',
				key: 'search',
				noRender: true,
			},
		],
		variant: 'MODAL',
	};
};
