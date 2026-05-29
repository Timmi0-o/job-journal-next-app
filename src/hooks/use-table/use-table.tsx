'use client';

import { ITableColumn } from '@/types/i-table.types';

import { Table } from '@/components/widgets/table/table';
import { ReactNode, useMemo, useState } from 'react';
import useLocalStorage from '../use-local-storage';
import { useManageSearchParams } from '../use-manage-search-params';
import { useUpdatePaginationStatesByRender } from './hooks/use-update-pagination-states-by-render';
import { IUseTableProps } from './types/i-use-table-props';

const SETTINGS_COLUMN: ITableColumn = {
	name: '',
	uid: '__settings__',
	sortable: false,
};

export const useTable = <T,>({
	columns,
	data,
	visibleColumnsKey = 'visibleColumns',
	isChangeQueryUrl = true,
	idRowPrefix,
	isLoading,
	...props
}: IUseTableProps<T>) => {
	const [visibleColumns, setVisibleColumns] = useLocalStorage<
		Set<string> | 'all' | 'none'
	>(visibleColumnsKey, new Set(columns.map((column) => column.name.toLowerCase())));

	const [rowsPerPage, setRowsPerPage] = useState('10');
	const [page, setPage] = useState(1);
	const [selectedKeys, setSelectedKeys] = useState<Set<string> | undefined | 'all'>(
		new Set([])
	);

	const pages = useMemo(
		() => Math.ceil(data.count / Number(rowsPerPage)),
		[data.count, rowsPerPage]
	);

	const { handlePushKeyInSearchParams } = useManageSearchParams();

	useUpdatePaginationStatesByRender({
		rowsPerPage,
		isChangeQueryUrl,
		setRowsPerPage,
		setPage,
	});

	const handlePageChange = (pageIndex: number): void => {
		handlePushKeyInSearchParams({
			key: 'page',
			value: pageIndex === 1 ? null : pageIndex,
		});
	};

	const headerColumns = useMemo(() => {
		let filteredColumns: ITableColumn[];
		if (visibleColumns === 'all') {
			filteredColumns = columns;
		} else if (visibleColumns === 'none') {
			filteredColumns = [];
		} else if (visibleColumns.size === 0) {
			filteredColumns = [];
		} else {
			filteredColumns = columns.filter((column) =>
				Array.from(visibleColumns).includes(column.name.toLowerCase())
			);
		}
		return [...filteredColumns, SETTINGS_COLUMN];
	}, [visibleColumns, columns]);

	const renderTable = (
		renderCell: (row: T & { id: number | string }, column: keyof T) => ReactNode
	) => {
		return (
			<Table<T>
				{...props}
				data={data}
				selectedKeys={selectedKeys as Set<string>}
				setSelectedKeys={setSelectedKeys}
				idRowPrefix={idRowPrefix}
				rowsPerPage={rowsPerPage}
				page={page}
				handlePageChange={handlePageChange}
				headerColumns={headerColumns}
				columns={columns}
				visibleColumns={visibleColumns as Set<string>}
				setVisibleColumns={setVisibleColumns}
				renderCell={renderCell as (item: T, column: keyof T) => ReactNode}
				pages={pages}
				isLoading={isLoading}
			/>
		);
	};

	return {
		rowsPerPage,
		page,
		setRowsPerPage,
		setPage,
		renderTable,
		filters: {
			limit: rowsPerPage,
			page,
		},
	};
};
