import { IGetActionPresets } from '@/types/i-action.types';

export type IStrictRange = { lt: string; gt: string };
export type IInclusiveRange = { lte: string; gte: string };

export interface IFormattedRangeField {
	value: (IStrictRange | IInclusiveRange)[];
	mode: 'OR';
}

export interface IFormattedStringField {
	value: string[];
	mode: 'OR' | 'AND';
}

export type IFormattedBooleanField = boolean;

export type IPaginationField = number | undefined;

export type ISearchField =
	| {
			value: string;
			mode: 'PARTIAL' | 'STRICT';
	  }
	| undefined;

export type IFormattedRequiredIdsField = string[];

export type IPresetField = IGetActionPresets | undefined;

export type IQueryField =
	| IFormattedRangeField
	| IFormattedStringField
	| IFormattedBooleanField
	| IPaginationField
	| ISearchField
	| IFormattedRequiredIdsField
	| IPresetField;
