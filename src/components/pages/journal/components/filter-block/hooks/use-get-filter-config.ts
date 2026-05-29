import { jobVariantsGet } from '@/actions/job-variant/actions'
import { unitsGet } from '@/actions/unit/actions'
import { IFilterWidgetConfig } from '@/components/widgets/base-filter-widget/types/i-filter-widget-config'

export const useGetFilterConfig = (): IFilterWidgetConfig => {
	return {
		filters: [
			{
				type: 'SELECT',
				key: 'jobVariantId',
				label: 'Вид работы',
				placeholder: 'Выберите вид работы',
				mode: 'ASYNC',
				fetchActions: jobVariantsGet,
				errorMessage: 'Ошибка загрузки видов работ',
				selectionMode: 'single',
			},
			{
				type: 'SELECT',
				key: 'unitId',
				label: 'Единица измерения',
				placeholder: 'Выберите единицу',
				mode: 'ASYNC',
				fetchActions: unitsGet,
				errorMessage: 'Ошибка загрузки единиц измерения',
				selectionMode: 'single',
			},
			{
				type: 'DATE',
				key: 'endDate',
				label: 'Дата окончания',
			},
		],
		variant: 'MODAL',
	}
}
