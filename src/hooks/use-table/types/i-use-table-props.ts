import { ITableColumn } from '@/types/i-table.types';
import { TableProps } from '@heroui/react';

export interface IUseTableProps<T> extends TableProps {
	columns: ITableColumn[];
	data: {
		count: number;
		rows: T[];
	};
	visibleColumnsKey?: string;
	isChangeQueryUrl?: boolean;
	idRowPrefix?: string;
	isLoading?: boolean;
}
