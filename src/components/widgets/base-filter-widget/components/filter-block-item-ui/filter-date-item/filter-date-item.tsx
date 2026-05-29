'use client';

import {
	formatFilterDateValue,
	parseFilterDateValue,
} from '@/components/widgets/base-filter-widget/utils/date-filter-value.util';
import { Calendar, DateField, DatePicker } from '@heroui/react';
import { observer } from 'mobx-react-lite';
import type { DateValue } from 'react-aria-components';
import { IFilterWidgetDateItem } from '../../../types/i-filter-widget-config';
import { FilterFieldShell } from '../../filter-field-shell/filter-field-shell';
import styles from './filter-date-item.module.css';

interface IFilterDateItemProps {
	item: IFilterWidgetDateItem;
	value: string | null;
	setValue: (value: string | null) => void;
}

export const FilterDateItem = observer(
	({ item, value, setValue }: IFilterDateItemProps) => {
		const dateValue = parseFilterDateValue(value);

		const handleChange = (nextValue: DateValue | null): void => {
			setValue(formatFilterDateValue(nextValue));
		};

		return (
			<FilterFieldShell label={item.label}>
				<DatePicker
					className={styles.datePicker}
					aria-label={item.label ?? item.key}
					value={dateValue}
					onChange={handleChange}
					granularity={item.granularity ?? 'day'}
					isRequired={false}
				>
					<DateField.Group className={styles.dateFieldGroup} variant="secondary">
						<DateField.Input>
							{(segment) => <DateField.Segment segment={segment} />}
						</DateField.Input>
						<DateField.Suffix>
							<DatePicker.Trigger>
								<DatePicker.TriggerIndicator />
							</DatePicker.Trigger>
						</DateField.Suffix>
					</DateField.Group>
					<DatePicker.Popover>
						<Calendar aria-label={item.label ?? 'Выбор даты'}>
							<Calendar.Header>
								<Calendar.YearPickerTrigger>
									<Calendar.YearPickerTriggerHeading />
									<Calendar.YearPickerTriggerIndicator />
								</Calendar.YearPickerTrigger>
								<Calendar.NavButton slot="previous" />
								<Calendar.NavButton slot="next" />
							</Calendar.Header>
							<Calendar.Grid>
								<Calendar.GridHeader>
									{(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
								</Calendar.GridHeader>
								<Calendar.GridBody>
									{(date) => <Calendar.Cell date={date} />}
								</Calendar.GridBody>
							</Calendar.Grid>
						</Calendar>
					</DatePicker.Popover>
				</DatePicker>
			</FilterFieldShell>
		);
	}
);
