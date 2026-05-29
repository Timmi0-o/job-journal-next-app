import { IRawQueryField } from '@/helpers/format-query-fields-helper';

export type IQueryFilterItemsConfig = Record<
	string,
	Omit<IRawQueryField, 'value' | 'key'> & { renameKey?: string }
>;
