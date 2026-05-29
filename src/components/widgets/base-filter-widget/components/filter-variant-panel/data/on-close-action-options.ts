import { IOnCloseAction } from '../../../types/i-on-close-action';

export interface IOnCloseActionOption {
	value: IOnCloseAction;
	label: string;
}

export const ON_CLOSE_ACTION_OPTIONS: IOnCloseActionOption[] = [
	{ value: 'APPLY', label: 'Применить при закрытии' },
	{ value: 'CANCEL', label: 'Отменить при закрытии' },
];
