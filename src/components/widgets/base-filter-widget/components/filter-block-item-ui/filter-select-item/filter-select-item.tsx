import { CloseIcon, Key, Label, ListBox, Select } from '@heroui/react';
import { closeButtonVariants } from '@heroui/styles';
import { observer } from 'mobx-react-lite';
import { IFilterWidgetSelectItem } from '../../../types/i-filter-widget-config';
import { FilterFieldShell } from '../../filter-field-shell/filter-field-shell';
import styles from './filter-select-item.module.css';

const CLEAR_BUTTON_CLASS_NAME = closeButtonVariants();

interface IFilterSelectItemProps {
	item: IFilterWidgetSelectItem;
	setValue: (value: Key | Key[] | null) => void;
	value: Key | Key[] | null;
}

export const FilterSelectItem = observer(
	({ item, setValue, value }: IFilterSelectItemProps) => {
		const isMultiple = item.selectionMode === 'multiple';
		const defaultValue = isMultiple ? [] : null;
		const isClearable: boolean = item.isClearable ?? true;
		const resolvedValue = value ?? defaultValue;

		const isSelectedValue = isMultiple
			? Array.isArray(resolvedValue) && resolvedValue.length > 0
			: resolvedValue != null;

		const isClearButtonVisible: boolean = isClearable && isSelectedValue;

		const handleClear = (): void => {
			setValue(defaultValue);
		};

		return (
			<FilterFieldShell label={item.label}>
				<Select
					className={styles.select}
					placeholder={item.placeholder}
					value={resolvedValue}
					onChange={(key) => setValue(key)}
					variant="secondary"
					selectionMode={item?.selectionMode || 'single'}
				>
					<Label className={styles.label}>{item.label}</Label>
					<Select.Trigger className={styles.select_trigger}>
						<Select.Value className={styles.select_value} />
						{isClearButtonVisible ? (
							<span
								role="button"
								tabIndex={0}
								aria-label="Очистить"
								className={CLEAR_BUTTON_CLASS_NAME}
								data-slot="close-button"
								onPointerDown={(event) => event.stopPropagation()}
								onClick={(event) => {
									event.stopPropagation();
									event.preventDefault();
									handleClear();
								}}
								onKeyDown={(event) => {
									if (event.key !== 'Enter' && event.key !== ' ') {
										return;
									}

									event.stopPropagation();
									event.preventDefault();
									handleClear();
								}}
							>
								<CloseIcon data-slot="close-button-icon" />
							</span>
						) : null}
						<Select.Indicator />
					</Select.Trigger>
					<Select.Popover>
						<ListBox>
							{item.options.map((option) => (
								<ListBox.Item
									key={option.value}
									id={option.value}
									textValue={option.label}
								>
									{option.label}
									<ListBox.ItemIndicator />
								</ListBox.Item>
							))}
						</ListBox>
					</Select.Popover>
				</Select>
			</FilterFieldShell>
		);
	}
);
