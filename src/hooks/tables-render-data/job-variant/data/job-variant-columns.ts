import { ITableColumn } from '@/types/i-table.types';

export const JOB_VARIANT_COLUMNS: ITableColumn[] = [
	{ name: 'ID', uid: 'id', sortable: true },
	{ name: 'Название', uid: 'name', sortable: true },
	{ name: 'Создано', uid: 'createdAt', sortable: true },
	{ name: 'Обновлено', uid: 'updatedAt', sortable: true },
	{ name: 'Действия', uid: 'actions', sortable: false },
] as const;

export type IJobVariantColumnKeys =
	| 'id'
	| 'name'
	| 'createdAt'
	| 'updatedAt'
	| 'actions';
