'use client';

import { IUser } from '@/actions/user/models/user.schema';
import { useRenderUsersCell } from '@/hooks/tables-render-data/user';
import { useTable } from '@/hooks/use-table/use-table';
import { IUseRenderUsersTableProps } from './i-render-users-table-props';

const VISIBLE_COLUMNS_KEY = 'visibleColumnsUser';

export const useRenderUsersTable = ({ data }: IUseRenderUsersTableProps) => {
	const { columns, renderCell } = useRenderUsersCell();

	const count: number = data.result?.meta?.totalCount || 0;
	const rows: IUser[] = Array.isArray(data.result?.data) ? data.result.data : [];

	const { renderTable } = useTable<IUser>({
		columns,
		data: {
			count,
			rows,
		},
		visibleColumnsKey: VISIBLE_COLUMNS_KEY,
	});

	return {
		renderTable: renderTable(renderCell as Parameters<typeof renderTable>[0]),
	};
};
