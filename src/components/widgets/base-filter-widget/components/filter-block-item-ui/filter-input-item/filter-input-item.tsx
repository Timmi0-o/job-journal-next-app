'use client'

import { Input } from '@/components/shared/ui/input/input'
import { observer } from 'mobx-react-lite'
import { IFilterWidgetInputItem } from '../../../types/i-filter-widget-config'
import { FilterFieldShell } from '../../filter-field-shell/filter-field-shell'
import styles from './filter-input-item.module.css'

interface IFilterInputItemProps {
	item: IFilterWidgetInputItem
	value: string | null
	setValue: (value: string) => void
}

export const FilterInputItem = observer(
	({ item, value, setValue }: IFilterInputItemProps) => {
		return (
			<FilterFieldShell label={item.label} htmlFor={item.key}>
				<Input
					id={item.key}
					isClearable={item.isClearable}
					value={value ?? ''}
					onChange={(e) => setValue(e.target.value)}
					placeholder={item.placeholder ?? 'Введите текст...'}
					className={item.className ?? styles.input}
				/>
			</FilterFieldShell>
		)
	},
)
