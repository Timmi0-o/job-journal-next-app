import { makeAutoObservable } from 'mobx';
import {
	IFilterWidgetConfig,
	TFilterWidgetFilterValue,
} from '../../types/i-filter-widget-config';
import { isFiltersEqual } from '../../utils/are-filters-equal';
import { buildFiltersFromSearchParams } from '../../utils/build-filters-from-search-params';
import { cloneFilters } from '../../utils/clone-filters';

const hydratedFilterWidgetStores = new WeakSet<object>();

class BaseFilterWidgetStoreTemplate<
	T extends { [K in keyof T]: TFilterWidgetFilterValue },
> {
	name: string;
	filters = {} as T;
	/** Зафиксированное состояние (URL при загрузке или после «Применить»). */
	baselineFilters = {} as T;

	constructor(name: string) {
		makeAutoObservable(this);
		this.name = name;
	}

	get isDirty(): boolean {
		return !isFiltersEqual(this.filters, this.baselineFilters);
	}

	hydrateFromSearchParams = (
		filtersConfig: IFilterWidgetConfig,
		searchParams: URLSearchParams
	): void => {
		if (hydratedFilterWidgetStores.has(this)) {
			return;
		}

		this.filters = buildFiltersFromSearchParams(filtersConfig, searchParams) as T;
		this.syncBaselineWithCurrentFilters();
		hydratedFilterWidgetStores.add(this);
	};

	/** Сбрасывает `isDirty`: текущие фильтры становятся эталоном. */
	syncBaselineWithCurrentFilters = () => {
		this.baselineFilters = cloneFilters(this.filters);
	};

	setFilter = (key: keyof T & string, value: TFilterWidgetFilterValue) => {
		this.filters[key as keyof T] = value as T[keyof T];
	};

	setFilters = (filters: T) => {
		this.filters = filters;
	};

	resetFilters = () => {
		this.filters = Object.keys(this.filters).reduce((acc, key) => {
			acc[key as keyof T] = null as T[keyof T];
			return acc as T;
		}, {} as T);
	};
}

const baseFilterWidgetStores = new Map<
	string,
	BaseFilterWidgetStoreTemplate<Record<string, TFilterWidgetFilterValue>>
>();

/**
 * Возвращает singleton MobX-store фильтров по ключу `name`.
 *
 * **Использовать только вместе с {@link BaseFilterWidget}** на той же странице:
 * тот же `name` / `FILTER_WIDGET_STORE_KEY(name)`, что передан в виджет.
 *
 * Допустимо читать/менять `filters` рядом с виджетом (например, отдельный Input
 * для `search`), если ключ store совпадает с виджетом и `BaseFilterWidget`
 * смонтирован — иначе фильтры не будут инициализированы из query-string.
 *
 * @see BaseFilterWidget
 * @see hydrateBaseFilterWidgetStoreFromSearchParams
 * @see FILTER_WIDGET_STORE_KEY
 */
export const BaseFilterWidgetStore = <
	T extends { [K in keyof T]: TFilterWidgetFilterValue },
>(
	name: string
): BaseFilterWidgetStoreTemplate<T> => {
	if (!baseFilterWidgetStores.has(name)) {
		baseFilterWidgetStores.set(name, new BaseFilterWidgetStoreTemplate(name));
	}

	return baseFilterWidgetStores.get(
		name
	) as unknown as BaseFilterWidgetStoreTemplate<T>;
};

/**
 * Один раз заполняет store из `searchParams` по `filtersConfig`.
 *
 * **Только для `BaseFilterWidget`.** Вызывается из виджета при монтировании;
 * повторные вызовы для того же инстанса store игнорируются (`WeakSet`).
 *
 * Снаружи виджета используйте {@link BaseFilterWidgetStore} для доступа к уже
 * созданному store с тем же `name`, что у пары `BaseFilterWidget`.
 *
 * @returns Тот же singleton, что и {@link BaseFilterWidgetStore}
 * @see BaseFilterWidget
 */
export const hydrateBaseFilterWidgetStoreFromSearchParams = <
	T extends { [K in keyof T]: TFilterWidgetFilterValue },
>(
	name: string,
	filtersConfig: IFilterWidgetConfig,
	searchParams: URLSearchParams
): void => {
	const store = BaseFilterWidgetStore<T>(name);

	if (!hydratedFilterWidgetStores.has(store)) {
		store.hydrateFromSearchParams(filtersConfig, searchParams);
	}
};
