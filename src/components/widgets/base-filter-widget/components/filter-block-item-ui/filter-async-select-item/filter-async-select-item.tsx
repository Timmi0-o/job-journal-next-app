'use client';

import { AsyncSelect } from '@/components/shared/ui/async-select/async-select';
import { observer } from 'mobx-react-lite';
import { IFilterWidgetSelectItemAsync } from '../../../types/i-filter-widget-config';
import { FilterFieldShell } from '../../filter-field-shell/filter-field-shell';
import styles from '../filter-select-item/filter-select-item.module.css';

interface IFilterAsyncSelectItemProps {
	item: IFilterWidgetSelectItemAsync;
	value: string | null;
	setValue: (value: string | null) => void;
}

export const FilterAsyncSelectItem = observer(
	({ item, value, setValue }: IFilterAsyncSelectItemProps) => {
		const idField =
			item.idCustomFieldForSelectItem ??
			((data: unknown) => (data as { id: string }).id);
		const nameField =
			item.nameCustomFieldForSelectItem ??
			((data: unknown) => (data as { name: string }).name);

		return (
			<FilterFieldShell label={item.label}>
				<AsyncSelect
					className={styles.select}
					placeholder={item.placeholder}
					actionFn={item.fetchActions}
					errorMessage={item.errorMessage}
					value={value ?? undefined}
					requiredIds={value ? [value] : undefined}
					onChange={setValue}
					idCustomFieldForSelectItem={idField}
					nameCustomFieldForSelectItem={nameField}
				/>
			</FilterFieldShell>
		);
	}
);
