'use client';

import { useConfirmation } from '@/hooks/use-confirmation';
import useLocalStorage from '@/hooks/use-local-storage';
import { useManageSearchParams } from '@/hooks/use-manage-search-params';
import { Key } from '@heroui/react';
import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import { FilterDateItem } from './components/filter-block-item-ui/filter-date-item/filter-date-item';
import { FilterAsyncSelectItem } from './components/filter-block-item-ui/filter-async-select-item/filter-async-select-item';
import { FilterCheckboxItem } from './components/filter-block-item-ui/filter-checkbox-item/filter-checkbox-item';
import { FilterInputItem } from './components/filter-block-item-ui/filter-input-item/filter-input-item';
import { FilterSelectItem } from './components/filter-block-item-ui/filter-select-item/filter-select-item';
import { FilterVariantModal } from './components/filter-block-render-variants/filter-variant-modal/filter-variant-modal';
import { FilterVariantPopover } from './components/filter-block-render-variants/filter-variant-popover/filter-variant-popover';
import { FILTER_WIDGET_STORE_KEY } from './config/filter-widget-store-key';
import { ON_CLOSE_ACTION_KEY } from './config/is-apply-on-close-key';
import {
	BaseFilterWidgetStore,
	hydrateBaseFilterWidgetStoreFromSearchParams,
} from './store/base-filter-widget/base-filter-widget.store';
import { IFilterVariantProps } from './types/i-filter-variant-props';
import {
	IFilterWidgetCheckboxItem,
	IFilterWidgetConfig,
	IFilterWidgetDateItem,
	IFilterWidgetInputItem,
	IFilterWidgetItem,
	IFilterWidgetSelectItem,
	IFilterWidgetSelectItemDefault,
	TFilterWidgetFilters,
	TFilterWidgetVariant,
	isAsyncFilterSelectItem,
} from './types/i-filter-widget-config';
import { IOnCloseAction } from './types/i-on-close-action';

/**
 * Пропсы {@link BaseFilterWidget}.
 */
interface IBaseFilterWidgetProps {
	/** Уникальное имя виджета на странице; формирует ключ MobX-store через {@link FILTER_WIDGET_STORE_KEY}. */
	name: string;
	/** Конфиг полей фильтра (SELECT, CHECKBOX, INPUT) и варианта UI (`MODAL` | `POPOVER`). */
	filtersConfig: IFilterWidgetConfig;
}

const DEFAULT_FILTER_VARIANT: TFilterWidgetVariant = 'MODAL';

/**
 * блок фильтров с полями из `filtersConfig`.
 *
 * Состояние фильтров хранится в {@link BaseFilterWidgetStore} и один раз
 * инициализируется из query-string при монтировании виджета
 * ({@link hydrateBaseFilterWidgetStoreFromSearchParams}). По кнопке «Применить» значения
 * пишутся в URL
 *
 * **Использование на странице**
 * 1. Задайте стабильный `name` (константа в `data/filter-widget-name.ts`).
 * 2. Соберите `filtersConfig` (хук `useGetFilterConfig` или аналог).
 * 3. Вставьте `<BaseFilterWidget name={...} filtersConfig={...} />` в `FilterBlock`.
 *
 * Чтобы связать отдельные контролы с тем же store (например, поиск вне модалки),
 * используйте {@link BaseFilterWidgetStore} с тем же `FILTER_WIDGET_STORE_KEY(name)`.
 * Виджет должен быть смонтирован — иначе store не получит гидратацию из URL.
 *
 * @see BaseFilterWidgetStore
 * @see hydrateBaseFilterWidgetStoreFromSearchParams
 * @see IFilterWidgetConfig
 */
export const BaseFilterWidget = observer(
	({ name, filtersConfig }: IBaseFilterWidgetProps) => {
		const [onCloseAction, seIOnCloseAction] = useLocalStorage<IOnCloseAction>(
			ON_CLOSE_ACTION_KEY(name),
			'APPLY'
		);

		const confirm = useConfirmation();

		const [isOpen, setIsOpen] = useState(false);

		const { handlePushKeyInSearchParams, searchParams } = useManageSearchParams();

		const storeKey = FILTER_WIDGET_STORE_KEY(name);

		hydrateBaseFilterWidgetStoreFromSearchParams(
			storeKey,
			filtersConfig,
			searchParams
		);

		const {
			setFilters,
			resetFilters,
			filters,
			syncBaselineWithCurrentFilters,
			isDirty,
			baselineFilters,
		} = BaseFilterWidgetStore<TFilterWidgetFilters>(storeKey);

		const variant = filtersConfig.variant ?? DEFAULT_FILTER_VARIANT;

		const pushFiltersToSearchParams = useCallback(
			(filters: TFilterWidgetFilters) => {
				handlePushKeyInSearchParams(
					Object.entries(filters).map(([key, value]) => ({
						key,
						value,
					}))
				);
			},
			[handlePushKeyInSearchParams]
		);

		const handleResetFiltersAndPushToSearchParams = () => {
			resetFilters();
			syncBaselineWithCurrentFilters();
			handlePushKeyInSearchParams(
				Object.keys(filters).map((key) => ({
					key,
					value: null,
				}))
			);
		};

		const applyFiltersAndClose = useCallback(() => {
			pushFiltersToSearchParams(filters);
			syncBaselineWithCurrentFilters();
			setIsOpen(false);
		}, [syncBaselineWithCurrentFilters, filters, pushFiltersToSearchParams]);

		const handleOpenChange = useCallback(
			(isNextOpen: boolean) => {
				if (isNextOpen) {
					setIsOpen(true);
					return;
				}

				if (onCloseAction === 'APPLY') {
					applyFiltersAndClose();
				} else if (onCloseAction === 'CANCEL') {
					setFilters(baselineFilters);
				}

				setIsOpen(false);
			},
			[applyFiltersAndClose, onCloseAction, baselineFilters, setFilters]
		);

		const renderFilter = useCallback(
			(filter: IFilterWidgetItem) => {
				if (filter.noRender) return null;

				if (filter.type === 'SELECT') {
					const selectItem = filter as IFilterWidgetSelectItem;

					if (isAsyncFilterSelectItem(selectItem)) {
						return (
							<FilterAsyncSelectItem
								key={selectItem.key}
								item={selectItem}
								value={filters[selectItem.key] as string | null}
								setValue={(value) =>
									setFilters({
										...filters,
										[selectItem.key]: value,
									} as typeof filters)
								}
							/>
						);
					}

					const defaultSelectItem = selectItem as IFilterWidgetSelectItemDefault;

					return (
						<FilterSelectItem
							key={defaultSelectItem.key}
							item={defaultSelectItem}
							value={filters[defaultSelectItem.key] as Key | Key[] | null}
							setValue={(value) =>
								setFilters({
									...filters,
									[defaultSelectItem.key]: value,
								} as typeof filters)
							}
						/>
					);
				}

				if (filter.type === 'CHECKBOX') {
					const checkboxItem = filter as IFilterWidgetCheckboxItem;
					return (
						<FilterCheckboxItem
							key={checkboxItem.key}
							item={checkboxItem}
							value={filters[checkboxItem.key] as boolean | null}
							setValue={(isValue: boolean) =>
								setFilters({
									...filters,
									[checkboxItem.key]: isValue,
								} as typeof filters)
							}
						/>
					);
				}

				if (filter.type === 'DATE') {
					const dateItem = filter as IFilterWidgetDateItem;

					return (
						<FilterDateItem
							key={dateItem.key}
							item={dateItem}
							value={filters[dateItem.key] as string | null}
							setValue={(value) =>
								setFilters({
									...filters,
									[dateItem.key]: value,
								} as typeof filters)
							}
						/>
					);
				}

				if (filter.type === 'INPUT') {
					const inputItem = filter as IFilterWidgetInputItem;
					return (
						<FilterInputItem
							key={inputItem.key}
							item={inputItem}
							value={filters[inputItem.key] as string | null}
							setValue={(value) =>
								setFilters({
									...filters,
									[inputItem.key]: value,
								} as typeof filters)
							}
						/>
					);
				}

				return null;
			},
			[filters, setFilters]
		);

		const handleClose = useCallback(() => {
			if (isDirty && onCloseAction === 'APPLY') {
				return confirm({
					title: 'Вы точно хотите уйти?',
					description: 'Все новые измененные фильтры будут удалены',
					primaryLabel: 'Да, уйти',
					cancelLabel: 'Остаться',
					status: 'danger',
					onConfirm: () => {
						setFilters(baselineFilters);
						setIsOpen(false);
					},
				});
			}

			setFilters(baselineFilters);
			setIsOpen(false);
		}, [confirm, isDirty, onCloseAction, baselineFilters, setFilters]);

		const filterVariantProps: IFilterVariantProps = {
			isOpen,
			onOpenChange: handleOpenChange,
			filters,
			filtersConfig,
			onCloseAction,
			seIOnCloseAction,
			onCloseActionRadioName: ON_CLOSE_ACTION_KEY(name),
			onApply: applyFiltersAndClose,
			onReset: resetFilters,
			hardReset: handleResetFiltersAndPushToSearchParams,
			renderFilter,
			handleClose,
		};

		return (
			<div className="flex items-center gap-3 flex-wrap">
				{variant === 'POPOVER' ? (
					<FilterVariantPopover {...filterVariantProps} />
				) : (
					<FilterVariantModal {...filterVariantProps} />
				)}
			</div>
		);
	}
);
