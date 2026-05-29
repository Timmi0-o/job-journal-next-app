'use client';

import { Drawer } from '@heroui/react';
import { IoOptions } from 'react-icons/io5';
import { IFilterVariantProps } from '../../../types/i-filter-variant-props';
import { getActiveFiltersCount } from '../../../utils/get-active-filters-count';
import { FilterTriggerButton } from '../../filter-trigger-button/filter-trigger-button';
import {
	FilterVariantPanelFilters,
	FilterVariantPanelFooter,
	FilterVariantPanelHeader,
} from '../../filter-variant-panel/filter-variant-panel';
import styles from './filter-variant-modal.module.css';

export const FilterVariantModal = ({
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
		<>
			<FilterTriggerButton
				activeCount={activeCount}
				onPress={() => onOpenChange(true)}
				onReset={hardReset}
			/>

			<Drawer>
				<Drawer.Backdrop
					isOpen={isOpen}
					onOpenChange={onOpenChange}
					variant="opaque"
				>
					<Drawer.Content placement="right">
						<Drawer.Dialog className={styles.dialog}>
							<Drawer.Header className={styles.header}>
								<FilterVariantPanelHeader
									filters={filters}
									onReset={onReset}
									icon={<IoOptions size={20} />}
								/>
							</Drawer.Header>

							<Drawer.Body className={styles.body}>
								<FilterVariantPanelFilters
									filtersConfig={filtersConfig}
									renderFilter={renderFilter}
								/>
							</Drawer.Body>

							<Drawer.Footer className={styles.footer}>
								<FilterVariantPanelFooter
									onCloseAction={onCloseAction}
									seIOnCloseAction={seIOnCloseAction}
									onCloseActionRadioName={onCloseActionRadioName}
									onCancel={handleClose}
									onApply={onApply}
								/>
							</Drawer.Footer>
						</Drawer.Dialog>
					</Drawer.Content>
				</Drawer.Backdrop>
			</Drawer>
		</>
	);
};
