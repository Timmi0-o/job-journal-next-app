'use client';

import { Popover } from '@heroui/react';
import { IFilterVariantProps } from '../../../types/i-filter-variant-props';
import { getActiveFiltersCount } from '../../../utils/get-active-filters-count';
import { FilterTriggerButton } from '../../filter-trigger-button/filter-trigger-button';
import {
	FilterVariantPanelFilters,
	FilterVariantPanelFooter,
	FilterVariantPanelHeader,
} from '../../filter-variant-panel/filter-variant-panel';
import styles from './filter-variant-popover.module.css';

export const FilterVariantPopover = ({
	isOpen,
	onOpenChange,
	filters,
	filtersConfig,
	onCloseAction,
	seIOnCloseAction,
	onCloseActionRadioName,
	onApply,
	onReset,
	hardReset,
	renderFilter,
	handleClose,
}: IFilterVariantProps): React.ReactElement => {
	const activeCount = getActiveFiltersCount(filters);

	return (
		<Popover isOpen={isOpen} onOpenChange={onOpenChange}>
			<FilterTriggerButton activeCount={activeCount} onReset={hardReset} />

			<Popover.Content placement="bottom start" className={styles.content}>
				<Popover.Dialog className={styles.dialog}>
					<FilterVariantPanelHeader filters={filters} onReset={onReset} isCompact />

					<FilterVariantPanelFilters
						filtersConfig={filtersConfig}
						renderFilter={renderFilter}
					/>

					<FilterVariantPanelFooter
						onCloseAction={onCloseAction}
						seIOnCloseAction={seIOnCloseAction}
						onCloseActionRadioName={onCloseActionRadioName}
						onCancel={handleClose}
						onApply={onApply}
					/>
				</Popover.Dialog>
			</Popover.Content>
		</Popover>
	);
};
