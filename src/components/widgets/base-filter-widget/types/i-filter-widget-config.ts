export type TFilterWidgetVariant = 'MODAL' | 'POPOVER';

export type TFilterWidgetFilterValue = string | string[] | boolean | null;

export type TFilterWidgetFilters = Record<string, TFilterWidgetFilterValue>;

interface IFilterWidgetItemIsBase {
	noRender?: boolean;
	key: string;
	label?: string;
}

export interface IFilterWidgetSelectItem extends IFilterWidgetItemIsBase {
	type: 'SELECT';
	placeholder: string;
	selectionMode?: 'multiple' | 'single';
	isClearable?: boolean;
	options: {
		label: string;
		value: string;
	}[];
}

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

export type IFilterWidgetItem =
	| IFilterWidgetSelectItem
	| IFilterWidgetCheckboxItem
	| IFilterWidgetInputItem;

export interface IFilterWidgetConfig {
	variant?: TFilterWidgetVariant;
	filters: IFilterWidgetItem[];
}
