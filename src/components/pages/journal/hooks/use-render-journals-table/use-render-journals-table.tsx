'use client';

import { IJournal } from '@/actions/journal/models/journal.schema';
import { useRenderJournalsCell } from '@/hooks/tables-render-data/journal';
import { useTable } from '@/hooks/use-table/use-table';
import { IUseRenderJournalsTableProps } from './i-render-journals-table-props';

const VISIBLE_COLUMNS_KEY = 'visibleColumnsJournal';

export const useRenderJournalsTable = ({ data }: IUseRenderJournalsTableProps) => {
	const { columns, renderCell } = useRenderJournalsCell();

	const count: number = data.result?.meta?.totalCount || 0;
	const rows: IJournal[] = Array.isArray(data.result?.data) ? data.result.data : [];

	const { renderTable } = useTable<IJournal>({
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
