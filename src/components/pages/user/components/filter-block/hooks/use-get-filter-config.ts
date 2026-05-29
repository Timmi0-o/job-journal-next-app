import { IFilterWidgetConfig } from '@/components/widgets/base-filter-widget/types/i-filter-widget-config'
import { USER_ROLES, USER_STATUSES } from '../data/filter-constants'

export const useGetFilterConfig = (): IFilterWidgetConfig => {
	return {
		filters: [
			{
				type: 'INPUT',
				key: 'search',
				noRender: true,
			},

			{
				type: 'SELECT',
				key: 'role',
				label: 'Роль',
				placeholder: 'Выберите роль',
				options: USER_ROLES.map((role) => ({
					label: role.label,
					value: role.value,
				})),
				selectionMode: 'multiple',
			},
			{
				type: 'SELECT',
				key: 'status',
				label: 'Статус',
				placeholder: 'Выберите статус',
				options: USER_STATUSES.map((status) => ({
					label: status.label,
					value: status.value,
				})),
				selectionMode: 'multiple',
			},
		],
		variant: 'MODAL',
	}
}
