import { Dispatch, ReactNode, SetStateAction } from 'react';
import {
	IFilterWidgetConfig,
	IFilterWidgetItem,
	TFilterWidgetFilters,
} from './i-filter-widget-config';
import { IOnCloseAction } from './i-on-close-action';

export interface IFilterVariantProps {
	isOpen: boolean;
	onOpenChange: (isNextOpen: boolean) => void;
	filters: TFilterWidgetFilters;
	filtersConfig: IFilterWidgetConfig;
	onCloseAction: IOnCloseAction;
	seIOnCloseAction: Dispatch<SetStateAction<IOnCloseAction>>;
	onCloseActionRadioName: string;
	onApply: () => void;
	onReset: () => void;
	hardReset: () => void;
	renderFilter: (filter: IFilterWidgetItem) => ReactNode;
	handleClose: () => void;
}
