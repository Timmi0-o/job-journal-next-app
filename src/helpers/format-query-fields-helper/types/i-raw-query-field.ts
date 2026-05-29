import { IFieldsTypes } from './i-query-field-types';

type IComparisonStrictness = 'STRICT' | 'INCLUSIVE';

export interface IRawQueryField {
	value: string | string[];
	mode?: 'OR' | 'AND' | 'PARTIAL' | 'STRICT';
	periodMode?: IComparisonStrictness;
	fieldType: IFieldsTypes;
	key: string;
}
