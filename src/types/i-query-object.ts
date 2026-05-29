import { IQueryField } from '@/helpers/format-query-fields-helper';

export type IQueryObject = Record<string, IQueryField | IQueryField[]> | undefined;
