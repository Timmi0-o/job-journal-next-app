import { ITableColumn } from '@/types/i-table.types';
import { TableProps } from '@heroui/react';
import { ReactNode } from 'react';

export interface ITableProps<T> extends TableProps {
	isLoading?: boolean;
	data: {
		count: number;
		rows: T[];
	};
	selectedKeys: Set<string>;
	setSelectedKeys: (keys: Set<string>) => void;
	idRowPrefix?: string;
	rowsPerPage: string;
	page: number;
	handlePageChange: (page: number) => void;
	headerColumns: ITableColumn[];
	columns: ITableColumn[];
	visibleColumns: Set<string>;
	setVisibleColumns: (columns: Set<string> | 'all' | 'none') => void;
	renderCell: (item: T, column: keyof T) => ReactNode;
	pages: number;
}
