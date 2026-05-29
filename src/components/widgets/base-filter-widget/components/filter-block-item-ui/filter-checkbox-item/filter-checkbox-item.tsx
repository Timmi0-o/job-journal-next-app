'use client';

import { Checkbox, Switch } from '@heroui/react';
import { observer } from 'mobx-react-lite';
import { IFilterWidgetCheckboxItem } from '../../../types/i-filter-widget-config';
import { FilterFieldShell } from '../../filter-field-shell/filter-field-shell';
import styles from './filter-checkbox-item.module.css';

interface IFilterCheckboxItemProps {
	item: IFilterWidgetCheckboxItem;
	value: boolean | null;
	setValue: (value: boolean) => void;
}

export const FilterCheckboxItem = observer(
	({ item, value, setValue }: IFilterCheckboxItemProps) => {
		if (item.variant === 'switch') {
			return (
				<FilterFieldShell
					layout="horizontal"
					label={item.label}
					htmlFor={item.key}
				>
					<Switch
						id={item.key}
						isSelected={value ?? false}
						onChange={setValue}
						size="md"
						className={styles.control}
						aria-labelledby={`${item.key}-label`}
					>
						<Switch.Control>
							<Switch.Thumb />
						</Switch.Control>
					</Switch>
				</FilterFieldShell>
			);
		}

		return (
			<FilterFieldShell layout="horizontal" label={item.label} htmlFor={item.key}>
				<Checkbox
					id={item.key}
					isSelected={value ?? false}
					onChange={setValue}
					className={styles.control}
					aria-labelledby={`${item.key}-label`}
				>
					<Checkbox.Control className={styles.checkbox_control}>
						<Checkbox.Indicator />
					</Checkbox.Control>
				</Checkbox>
			</FilterFieldShell>
		);
	}
);
