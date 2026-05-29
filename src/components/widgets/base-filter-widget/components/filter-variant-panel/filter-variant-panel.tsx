'use client';

import { Button, Label, Radio, RadioGroup } from '@heroui/react';
import clsx from 'clsx';
import { ReactNode } from 'react';
import { FiX } from 'react-icons/fi';
import {
	IFilterWidgetConfig,
	IFilterWidgetItem,
	TFilterWidgetFilters,
} from '../../types/i-filter-widget-config';
import { IOnCloseAction } from '../../types/i-on-close-action';
import { getActiveFiltersCount } from '../../utils/get-active-filters-count';
import { ON_CLOSE_ACTION_OPTIONS } from './data/on-close-action-options';
import styles from './filter-variant-panel.module.css';

interface IFilterVariantPanelHeaderProps {
	filters: TFilterWidgetFilters;
	onReset: () => void;
	isCompact?: boolean;
	icon?: ReactNode;
	subtitle?: string;
}

export const FilterVariantPanelHeader = ({
	filters,
	onReset,
	isCompact = false,
	icon,
	subtitle,
}: IFilterVariantPanelHeaderProps): React.ReactElement => {
	const activeCount = getActiveFiltersCount(filters);
	const hasActiveFilters = activeCount > 0;

	return (
		<div className={styles.header}>
			<div className={styles.header_with_icon}>
				{icon ? (
					<div className={`${styles.header_icon} bg-accent-soft text-accent`}>
						{icon}
					</div>
				) : null}
				<div className={styles.header_titles}>
					<span
						className={clsx(styles.title, {
							[styles.title_compact]: isCompact,
						})}
					>
						Фильтры
					</span>
					{subtitle ? <span className={styles.subtitle}>{subtitle}</span> : null}
				</div>
			</div>
			{hasActiveFilters ? (
				<Button size="sm" variant="danger-soft" onPress={onReset}>
					<FiX size={16} />
					Сбросить
				</Button>
			) : null}
		</div>
	);
};

interface IFilterVariantPanelFiltersProps {
	filtersConfig: IFilterWidgetConfig;
	renderFilter: (filter: IFilterWidgetItem) => React.ReactNode;
}

export const FilterVariantPanelFilters = ({
	filtersConfig,
	renderFilter,
}: IFilterVariantPanelFiltersProps): React.ReactElement => (
	<div className={styles.filters}>
		{filtersConfig.filters.map((filter) => renderFilter(filter))}
	</div>
);

interface IFilterVariantPanelFooterProps {
	onCloseAction: IOnCloseAction;
	seIOnCloseAction: (value: IOnCloseAction) => void;
	onCloseActionRadioName: string;
	onCancel: () => void;
	onApply: () => void;
}

const handleOnCloseActionChange = (
	value: string,
	seIOnCloseAction: (value: IOnCloseAction) => void
): void => {
	if (value === 'APPLY' || value === 'CANCEL') {
		seIOnCloseAction(value);
	}
};

export const FilterVariantPanelFooter = ({
	onCloseAction,
	seIOnCloseAction,
	onCloseActionRadioName,
	onCancel,
	onApply,
}: IFilterVariantPanelFooterProps): React.ReactElement => (
	<div className={styles.footer}>
		<RadioGroup
			name={onCloseActionRadioName}
			value={onCloseAction}
			onChange={(value) => handleOnCloseActionChange(value, seIOnCloseAction)}
			orientation="horizontal"
			variant="secondary"
			className={styles.on_close_action_group}
		>
			{ON_CLOSE_ACTION_OPTIONS.map((option) => (
				<Radio key={option.value} value={option.value}>
					<Radio.Control className="size-4">
						<Radio.Indicator />
					</Radio.Control>
					<Radio.Content>
						<Label className={styles.on_close_action_label}>{option.label}</Label>
					</Radio.Content>
				</Radio>
			))}
		</RadioGroup>
		<div className={styles.footer_actions}>
			<Button size="sm" variant="tertiary" onPress={onCancel} className="flex-1">
				Отмена
			</Button>
			<Button size="sm" variant="primary" onPress={onApply} className="flex-1">
				Применить
			</Button>
		</div>
	</div>
);
