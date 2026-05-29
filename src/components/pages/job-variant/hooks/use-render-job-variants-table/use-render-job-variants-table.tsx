'use client';

import { IJobVariant } from '@/actions/job-variant/models/job-variant.schema';
import { useRenderJobVariantsCell } from '@/hooks/tables-render-data/job-variant';
import { useTable } from '@/hooks/use-table/use-table';
import { IUseRenderJobVariantsTableProps } from './i-render-job-variants-table-props';

const VISIBLE_COLUMNS_KEY = 'visibleColumnsJobVariant';

export const useRenderJobVariantsTable = ({
	data,
}: IUseRenderJobVariantsTableProps) => {
	const { columns, renderCell } = useRenderJobVariantsCell();

	const count: number = data.result?.meta?.totalCount || 0;
	const rows: IJobVariant[] = Array.isArray(data.result?.data)
		? data.result.data
		: [];

	const { renderTable } = useTable<IJobVariant>({
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
