import { ITableColumn } from '@/types/i-table.types';

export interface ITableSettingsPopoverProps {
	columns: ITableColumn[];
	visibleColumns: Set<string> | 'all' | 'none';
	rowsPerPage: string;
	totalCount: number;
	selectedCount: number;
	onVisibleColumnsChange: (columns: Set<string> | 'all' | 'none') => void;
}
