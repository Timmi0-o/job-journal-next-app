'use client';

import { IActionResponse, IGetActionOptions } from '@/types/i-action.types';
import { FieldError, Label, ListBox, Select, toast } from '@heroui/react';
import React from 'react';
import { Collection } from 'react-aria-components';
import { Controller, Path, useFormContext } from 'react-hook-form';

/** Достаточно id и name для превью; полный объект T тоже подходит */
export type IAsyncSelectInitialOption<T> = { id: string; name: string } & Partial<T>;

interface IAsyncSelectProps<T> {
	fetchDelay?: number;
	actionFn: (options: Partial<IGetActionOptions>) => Promise<unknown>;
	/** Показываются сразу (до ответа API), например выбранное значение при редактировании */
	initialOptions?: ReadonlyArray<IAsyncSelectInitialOption<T>>;
	nameCustomFieldForSelectItem?: (data: T) => string;
	idCustomFieldForSelectItem?: (data: T) => string;
	errorMessage?: string;
	requiredIds?: string[];
}

export function useAsyncGetItems<T>({
	fetchDelay = 0,
	actionFn,
	errorMessage,
	initialOptions,
	nameCustomFieldForSelectItem = (data: T) =>
		(data as unknown as { name: string }).name,
	idCustomFieldForSelectItem = (data: T) => (data as unknown as { id: string }).id,
	requiredIds,
}: IAsyncSelectProps<T>) {
	const initialOptionsRef = React.useRef(initialOptions);
	initialOptionsRef.current = initialOptions;

	const projectItem = (item: IAsyncSelectInitialOption<T>): T =>
		({
			name: nameCustomFieldForSelectItem(item as T),
			id: idCustomFieldForSelectItem(item as T),
		}) as T;

	const [items, setItems] = React.useState<T[]>(() =>
		(initialOptions ?? []).map(projectItem)
	);

	const initialOptionsSignature = React.useMemo((): string => {
		return (initialOptions ?? [])
			.map((o) => idCustomFieldForSelectItem(o as T))
			.sort()
			.join(',');
	}, [initialOptions, idCustomFieldForSelectItem]);
	const [hasMore, setHasMore] = React.useState(true);
	const [isLoading, setIsLoading] = React.useState(false);
	const [currentPage, setCurrentPage] = React.useState(1);
	const limit = 30;
	const isInitialLoadRef = React.useRef(false);

	const loadPokemon = async (currentPage: number): Promise<void> => {
		try {
			setIsLoading(true);

			if (currentPage > 1) {
				await new Promise(
					(resolve): NodeJS.Timeout => setTimeout(resolve, fetchDelay)
				);
			}

			const res = (await actionFn({
				filters: {
					page: currentPage,
					limit,
					requiredIds,
				},
			})) as IActionResponse<T[]>;

			if (res.error) {
				toast.danger(
					errorMessage ? errorMessage : 'Ошибка загрузки данных в селект'
				);
				const fallback = (initialOptionsRef.current ?? []).map(projectItem);
				setItems(fallback);
				setHasMore(false);
				setIsLoading(false);
				return;
			}

			if (res.result) {
				setHasMore(
					() => (res.result.meta?.totalCount ?? 0) > (res.result.meta?.total ?? 0)
				);

				setItems((prevItems: T[]): T[] => [
					...prevItems,
					...(res.result?.data
						?.filter(
							(item: T) =>
								!prevItems
									.map((item) => idCustomFieldForSelectItem(item))
									.includes(idCustomFieldForSelectItem(item))
						)
						.map((item: T) => ({
							name: nameCustomFieldForSelectItem(item),
							id: idCustomFieldForSelectItem(item),
						})) as T[]),
				]);
			}
		} catch (error: unknown) {
			console.error('AsyncSelect error:', error);
			if (error instanceof Error && error.name === 'AbortError') {
				toast.danger(`Загрузка данных в селект прервана ${actionFn.name}`);
			} else {
				toast.danger(
					`Ошибка загрузки данных в селект ${actionFn.name}`,
					error instanceof Error
						? { description: error.message }
						: { description: 'Неизвестная ошибка' }
				);
			}
		} finally {
			setIsLoading(false);
		}
	};

	React.useEffect(() => {
		if (!initialOptionsSignature) {
			return;
		}
		const latest = initialOptionsRef.current ?? [];
		setItems((prev) => {
			const mapped = latest.map(projectItem);
			const initialIds = new Set(mapped.map((m) => idCustomFieldForSelectItem(m)));
			const rest = prev.filter(
				(p) => !initialIds.has(idCustomFieldForSelectItem(p))
			);
			return [...mapped, ...rest];
		});
	}, [
		initialOptionsSignature,
		nameCustomFieldForSelectItem,
		idCustomFieldForSelectItem,
	]);

	React.useEffect(() => {
		if (!isInitialLoadRef.current) {
			isInitialLoadRef.current = true;
			loadPokemon(currentPage);
		}
	}, []);

	const onLoadMore = (): void => {
		if (!hasMore) return;
		const newPage = currentPage + 1;

		setCurrentPage(newPage);
		loadPokemon(newPage);
	};

	return {
		items,
		hasMore,
		isLoading,
		onLoadMore,
	};
}

interface IAsyncSelectListItem {
	id: string;
	name: string;
}

const AsyncSelectForm = <TSelect, TForm extends Record<string, unknown>>({
	items,
	isLoading: _isLoading,
	scrollerRef,
	setIsOpen,
	label,
	placeholder,
	name,
	className,
}: {
	items: TSelect[];
	isLoading: boolean;
	scrollerRef: React.RefObject<HTMLDivElement | null>;
	setIsOpen: (value: boolean) => void;
	label?: string;
	placeholder?: string;
	name: Path<TForm>;
	className?: string;
}) => {
	const { control, trigger } = useFormContext<TForm>();

	const listItems = React.useMemo((): IAsyncSelectListItem[] => {
		return items.map((item) => ({
			id: (item as unknown as { id: string }).id,
			name: (item as unknown as { name: string }).name,
		}));
	}, [items]);

	return (
		<Controller
			control={control}
			name={name}
			render={({
				field: { onChange, value, onBlur, name: fieldName },
				fieldState: { error },
			}) => {
				return (
					<Select
						key={`${String(name)}-${String(!!error)}`}
						className={className}
						name={fieldName}
						placeholder={placeholder || 'Не выбрано'}
						validationBehavior="aria"
						isInvalid={!!error}
						value={value ? String(value) : null}
						onChange={(key) => {
							onChange(key != null ? String(key) : null);
							void trigger(name);
						}}
						onBlur={onBlur}
						onOpenChange={setIsOpen}
					>
						<Label>{label || 'Выберите элемент'}</Label>
						<Select.Trigger>
							<Select.Value />
							<Select.Indicator />
						</Select.Trigger>
						<Select.Popover>
							<ListBox ref={scrollerRef}>
								<Collection items={listItems}>
									{(item: IAsyncSelectListItem) => (
										<ListBox.Item
											id={item.id}
											textValue={item.name}
											className="capitalize"
										>
											{item.name}
											<ListBox.ItemIndicator />
										</ListBox.Item>
									)}
								</Collection>
							</ListBox>
						</Select.Popover>
						<FieldError>{error?.message}</FieldError>
					</Select>
				);
			}}
		/>
	);
};

export const AsyncSelect = <TSelect, TForm extends Record<string, unknown>>({
	actionFn,
	initialOptions,
	label,
	placeholder,
	isForm = false,
	name,
	nameCustomFieldForSelectItem,
	idCustomFieldForSelectItem,
	value,
	onChange,
	className,
	requiredIds,
	errorMessage,
}: IAsyncSelectProps<TSelect> & {
	label?: string;
	placeholder?: string;
	isForm?: boolean;
	name?: Path<TForm>;
	nameCustomFieldForSelectItem?: (data: TSelect) => string;
	idCustomFieldForSelectItem?: (data: TSelect) => string;
	value?: string;
	onChange?: (value: string | null) => void;
	className?: string;
}) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const { items, hasMore, isLoading, onLoadMore } = useAsyncGetItems<TSelect>({
		fetchDelay: 1500,
		actionFn,
		initialOptions,
		nameCustomFieldForSelectItem,
		requiredIds,
		idCustomFieldForSelectItem,
		errorMessage,
	});

	const listItems = React.useMemo((): IAsyncSelectListItem[] => {
		return items.map((item) => ({
			id: (item as unknown as { id: string }).id,
			name: (item as unknown as { name: string }).name,
		}));
	}, [items]);

	const scrollerRef = React.useRef<HTMLDivElement | null>(null);

	React.useEffect(() => {
		const el = scrollerRef.current;
		if (!el || !isOpen || !hasMore) return;

		const handleScroll = (): void => {
			const threshold = 40;
			const isNearBottom =
				el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
			if (isNearBottom && hasMore && !isLoading) {
				onLoadMore();
			}
		};

		el.addEventListener('scroll', handleScroll, { passive: true });
		return () => el.removeEventListener('scroll', handleScroll);
	}, [isOpen, hasMore, isLoading, onLoadMore]);

	if (isForm && name) {
		return (
			<AsyncSelectForm
				className={className}
				items={items}
				isLoading={isLoading}
				scrollerRef={scrollerRef}
				setIsOpen={setIsOpen}
				label={label}
				placeholder={placeholder}
				name={name}
			/>
		);
	}

	return (
		<Select
			className={className}
			aria-label={label || 'Выбор элемента'}
			placeholder={placeholder || 'Не выбрано'}
			variant="secondary"
			value={value ? String(value) : null}
			fullWidth
			onChange={(key) => {
				if (onChange) {
					onChange(key != null ? String(key) : null);
				}
			}}
			onOpenChange={setIsOpen}
		>
			{label ? <Label>{label}</Label> : null}
			<Select.Trigger>
				<Select.Value />
				<Select.Indicator />
			</Select.Trigger>
			<Select.Popover>
				<ListBox ref={scrollerRef}>
					<Collection items={listItems}>
						{(item: IAsyncSelectListItem) => (
							<ListBox.Item
								id={item.id}
								textValue={item.name}
								className="capitalize"
							>
								{item.name}
								<ListBox.ItemIndicator />
							</ListBox.Item>
						)}
					</Collection>
				</ListBox>
			</Select.Popover>
		</Select>
	);
};
