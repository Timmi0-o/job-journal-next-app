import { ITableColumn } from '@/types/i-table.types';

export const USER_COLUMNS: ITableColumn[] = [
	{ name: 'ID', uid: 'id', sortable: true },
	{ name: 'ФИО', uid: 'name', sortable: true },
	{ name: 'Email', uid: 'email', sortable: true },
	{ name: 'Роль', uid: 'role', sortable: true },
	{ name: 'Статус', uid: 'status', sortable: true },
	{ name: 'Дата регистрации', uid: 'createdAt', sortable: true },
	{ name: 'Дата обновления', uid: 'updatedAt', sortable: true },
	{ name: 'Действия', uid: 'actions', sortable: false },
] as const;

export type IUserColumnKeys =
	| 'id'
	| 'name'
	| 'email'
	| 'role'
	| 'status'
	| 'createdAt'
	| 'updatedAt'
	| 'actions';
