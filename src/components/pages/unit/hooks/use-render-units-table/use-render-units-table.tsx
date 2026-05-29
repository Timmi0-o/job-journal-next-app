'use client';

import { IUnit } from '@/actions/unit/models/unit.schema';
import { useRenderUnitsCell } from '@/hooks/tables-render-data/unit';
import { useTable } from '@/hooks/use-table/use-table';
import { IUseRenderUnitsTableProps } from './i-render-units-table-props';

const VISIBLE_COLUMNS_KEY = 'visibleColumnsUnit';

export const useRenderUnitsTable = ({ data }: IUseRenderUnitsTableProps) => {
	const { columns, renderCell } = useRenderUnitsCell();

	const count: number = data.result?.meta?.totalCount || 0;
	const rows: IUnit[] = Array.isArray(data.result?.data) ? data.result.data : [];

	const { renderTable } = useTable<IUnit>({
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
