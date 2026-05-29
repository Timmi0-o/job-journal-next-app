import { IFilterWidgetConfig } from '@/components/widgets/base-filter-widget/types/i-filter-widget-config';

export const useGetFilterConfig = (): IFilterWidgetConfig => {
	return {
		filters: [
			{
				type: 'INPUT',
				key: 'jobVariantId',
				label: 'ID вида работы',
				placeholder: 'UUID вида работы',
			},
			{
				type: 'INPUT',
				key: 'unitId',
				label: 'ID единицы измерения',
				placeholder: 'UUID единицы',
			},
			{
				type: 'INPUT',
				key: 'endDate',
				label: 'Дата окончания',
				placeholder: 'YYYY-MM-DD',
			},
		],
		variant: 'MODAL',
	};
};
