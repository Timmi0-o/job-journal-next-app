import { IGetActionOptions } from '@/types/i-action.types';

export type TFilterWidgetVariant = 'MODAL' | 'POPOVER';

export type TFilterWidgetFilterValue = string | string[] | boolean | null;

export type TFilterWidgetFilters = Record<string, TFilterWidgetFilterValue>;

interface IFilterWidgetItemIsBase {
	noRender?: boolean;
	key: string;
	label?: string;
}

export type TFilterWidgetSelectMode = 'DEFAULT' | 'ASYNC';

interface IFilterWidgetSelectItemBase extends IFilterWidgetItemIsBase {
	type: 'SELECT';
	placeholder: string;
	selectionMode?: 'multiple' | 'single';
	isClearable?: boolean;
	mode?: TFilterWidgetSelectMode;
}

export interface IFilterWidgetSelectItemDefault extends IFilterWidgetSelectItemBase {
	mode?: 'DEFAULT';
	options: {
		label: string;
		value: string;
	}[];
}

export interface IFilterWidgetSelectItemAsync extends IFilterWidgetSelectItemBase {
	mode: 'ASYNC';
	fetchActions: (options: Partial<IGetActionOptions>) => Promise<unknown>;
	errorMessage?: string;
	nameCustomFieldForSelectItem?: (data: unknown) => string;
	idCustomFieldForSelectItem?: (data: unknown) => string;
}

export type IFilterWidgetSelectItem =
	| IFilterWidgetSelectItemDefault
	| IFilterWidgetSelectItemAsync;

export interface IFilterWidgetCheckboxItem extends IFilterWidgetItemIsBase {
	type: 'CHECKBOX';
	variant: 'checkbox' | 'switch';
}

export interface IFilterWidgetInputItem extends IFilterWidgetItemIsBase {
	type: 'INPUT';
	placeholder?: string;
	isClearable?: boolean;
	className?: string;
}

export interface IFilterWidgetDateItem extends IFilterWidgetItemIsBase {
	type: 'DATE';
	placeholder?: string;
	isClearable?: boolean;
	className?: string;
	granularity?: 'day' | 'hour' | 'minute' | 'second';
}

export type IFilterWidgetItem =
	| IFilterWidgetSelectItem
	| IFilterWidgetCheckboxItem
	| IFilterWidgetInputItem
	| IFilterWidgetDateItem;

export interface IFilterWidgetConfig {
	variant?: TFilterWidgetVariant;
	filters: IFilterWidgetItem[];
}

export const isAsyncFilterSelectItem = (
	item: IFilterWidgetSelectItem
): item is IFilterWidgetSelectItemAsync => item.mode === 'ASYNC';
