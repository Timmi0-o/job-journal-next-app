import { ITableColumn } from '@/types/i-table.types';

export const JOURNAL_COLUMNS: ITableColumn[] = [
	{ name: 'ID', uid: 'id', sortable: true },
	{ name: 'Вид работы', uid: 'jobVariantId', sortable: true },
	{ name: 'Количество', uid: 'amount', sortable: true },
	{ name: 'Единица', uid: 'unitId', sortable: true },
	{ name: 'Дата окончания', uid: 'endDate', sortable: true },
	{ name: 'Создано', uid: 'createdAt', sortable: true },
	{ name: 'Действия', uid: 'actions', sortable: false },
] as const;

export type IJournalColumnKeys =
	| 'id'
	| 'jobVariantId'
	| 'amount'
	| 'unitId'
	| 'endDate'
	| 'createdAt'
	| 'actions';
