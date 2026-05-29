'use client'

import { IActionResponse, IGetActionOptions } from '@/types/i-action.types'
import { FieldError, Label, ListBox, Select, toast } from '@heroui/react'
import React from 'react'
import { Collection } from 'react-aria-components'
import { Controller, Path, useFormContext } from 'react-hook-form'

/** Достаточно id и name для превью; полный объект T тоже подходит */
export type IAsyncSelectInitialOption<T> = {
	id: string
	name: string
} & Partial<T>

interface IAsyncSelectProps<T> {
	fetchDelay?: number
	actionFn: (options: Partial<IGetActionOptions>) => Promise<unknown>
	/** Показываются сразу (до ответа API), например выбранное значение при редактировании */
	initialOptions?: ReadonlyArray<IAsyncSelectInitialOption<T>>
	nameCustomFieldForSelectItem?: (data: T) => string
	idCustomFieldForSelectItem?: (data: T) => string
	errorMessage?: string
	requiredIds?: string[]
}

const SCROLL_THRESHOLD_PX = 40
const DEFAULT_PAGE_SIZE = 30

const mapPageItems = <T,>(
	pageItems: T[],
	prevItems: T[],
	idCustomFieldForSelectItem: (data: T) => string,
	nameCustomFieldForSelectItem: (data: T) => string,
): T[] => {
	const existingIds = new Set(
		prevItems.map((item) => idCustomFieldForSelectItem(item)),
	)

	return pageItems
		.filter((item) => !existingIds.has(idCustomFieldForSelectItem(item)))
		.map(
			(item) =>
				({
					id: idCustomFieldForSelectItem(item),
					name: nameCustomFieldForSelectItem(item),
				}) as T,
		)
}

const resolveHasMore = (
	loadedCount: number,
	pageItemsCount: number,
	totalCount: number | undefined,
): boolean => {
	if (pageItemsCount === 0) {
		return false
	}

	if (totalCount == null) {
		return pageItemsCount >= DEFAULT_PAGE_SIZE
	}

	return loadedCount < totalCount
}

function useInfiniteListLoader({
	isOpen,
	hasMore,
	isLoading,
	itemsLength,
	onLoadMore,
}: {
	isOpen: boolean
	hasMore: boolean
	isLoading: boolean
	itemsLength: number
	onLoadMore: () => void
}) {
	const scrollContainerRef = React.useRef<HTMLDivElement | null>(null)
	const onLoadMoreRef = React.useRef(onLoadMore)
	const hasMoreRef = React.useRef(hasMore)
	const isLoadingRef = React.useRef(isLoading)

	onLoadMoreRef.current = onLoadMore
	hasMoreRef.current = hasMore
	isLoadingRef.current = isLoading

	const setScrollContainerRef = React.useCallback(
		(node: HTMLDivElement | null) => {
			scrollContainerRef.current = node
		},
		[],
	)

	const tryLoadMore = React.useCallback((): void => {
		if (!hasMoreRef.current || isLoadingRef.current) {
			return
		}

		onLoadMoreRef.current()
	}, [])

	const checkNearBottom = React.useCallback((): void => {
		const el = scrollContainerRef.current

		if (!el) {
			return
		}

		const isNearBottom =
			el.scrollHeight - el.scrollTop - el.clientHeight <= SCROLL_THRESHOLD_PX

		if (isNearBottom) {
			tryLoadMore()
		}
	}, [tryLoadMore])

	React.useEffect(() => {
		const el = scrollContainerRef.current

		if (!el || !isOpen || !hasMore) {
			return
		}

		const handleScroll = (): void => {
			checkNearBottom()
		}

		el.addEventListener('scroll', handleScroll, { passive: true })

		return () => el.removeEventListener('scroll', handleScroll)
	}, [isOpen, hasMore, checkNearBottom, itemsLength])

	React.useEffect(() => {
		if (!isOpen || isLoading || !hasMore) {
			return
		}

		checkNearBottom()
	}, [isOpen, isLoading, hasMore, itemsLength, checkNearBottom])

	return { setScrollContainerRef }
}

interface IAsyncSelectListBoxProps {
	listItems: IAsyncSelectListItem[]
	setScrollContainerRef: (node: HTMLDivElement | null) => void
	hasMore: boolean
	isLoading: boolean
}

const AsyncSelectListBox = ({
	listItems,
	setScrollContainerRef,
	hasMore,
	isLoading,
}: IAsyncSelectListBoxProps) => (
	<div
		ref={setScrollContainerRef}
		className='max-h-[min(280px,40vh)] overflow-y-auto'
	>
		<ListBox>
			<Collection items={listItems}>
				{(item: IAsyncSelectListItem) => (
					<ListBox.Item
						id={item.id}
						textValue={item.name}
						className='capitalize'
					>
						{item.name}
						<ListBox.ItemIndicator />
					</ListBox.Item>
				)}
			</Collection>
		</ListBox>
		{isLoading ? (
			<div aria-hidden className='px-3 py-2 text-xs text-zinc-500'>
				Загрузка...
			</div>
		) : null}
		{!hasMore && listItems.length === 0 ? (
			<div aria-hidden className='px-3 py-2 text-xs text-zinc-500'>
				Нет данных
			</div>
		) : null}
	</div>
)

export function useAsyncGetItems<T>({
	fetchDelay = 0,
	actionFn,
	errorMessage,
	initialOptions,
	nameCustomFieldForSelectItem = (data: T) =>
		(data as unknown as { name: string }).name,
	idCustomFieldForSelectItem = (data: T) =>
		(data as unknown as { id: string }).id,
	requiredIds,
}: IAsyncSelectProps<T>) {
	const initialOptionsRef = React.useRef(initialOptions)
	initialOptionsRef.current = initialOptions

	const projectItem = (item: IAsyncSelectInitialOption<T>): T =>
		({
			name: nameCustomFieldForSelectItem(item as T),
			id: idCustomFieldForSelectItem(item as T),
		}) as T

	const [items, setItems] = React.useState<T[]>(() =>
		(initialOptions ?? []).map(projectItem),
	)

	const initialOptionsSignature = React.useMemo((): string => {
		return (initialOptions ?? [])
			.map((o) => idCustomFieldForSelectItem(o as T))
			.sort()
			.join(',')
	}, [initialOptions, idCustomFieldForSelectItem])
	const [hasMore, setHasMore] = React.useState(true)
	const [isLoading, setIsLoading] = React.useState(false)
	const limit = DEFAULT_PAGE_SIZE
	const isInitialLoadRef = React.useRef(false)
	const isLoadingRef = React.useRef(false)
	const hasMoreRef = React.useRef(true)
	const currentPageRef = React.useRef(1)

	const loadPage = React.useCallback(
		async (page: number): Promise<void> => {
			if (isLoadingRef.current) {
				return
			}

			isLoadingRef.current = true
			setIsLoading(true)

			try {
				if (page > 1 && fetchDelay > 0) {
					await new Promise((resolve) => setTimeout(resolve, fetchDelay))
				}

				const res = (await actionFn({
					filters: {
						page,
						limit,
						requiredIds,
					},
				})) as IActionResponse<T[]>

				if (res.error) {
					toast.danger(
						errorMessage ? errorMessage : 'Ошибка загрузки данных в селект',
					)
					const fallback = (initialOptionsRef.current ?? []).map(projectItem)
					setItems(fallback)
					hasMoreRef.current = false
					setHasMore(false)
					return
				}

				if (!res.result) {
					return
				}

				const pageItems = res.result.data ?? []
				const totalCount = res.result.meta?.totalCount

				setItems((prevItems) => {
					const nextItems = mapPageItems(
						pageItems,
						prevItems,
						idCustomFieldForSelectItem,
						nameCustomFieldForSelectItem,
					)
					const mergedItems = [...prevItems, ...nextItems]
					const nextHasMore = resolveHasMore(
						mergedItems.length,
						nextItems.length,
						totalCount,
					)

					hasMoreRef.current = nextHasMore
					setHasMore(nextHasMore)

					return mergedItems
				})
			} catch (error: unknown) {
				console.error('AsyncSelect error:', error)
				if (error instanceof Error && error.name === 'AbortError') {
					toast.danger(`Загрузка данных в селект прервана ${actionFn.name}`)
				} else {
					toast.danger(
						`Ошибка загрузки данных в селект ${actionFn.name}`,
						error instanceof Error
							? { description: error.message }
							: { description: 'Неизвестная ошибка' },
					)
				}
			} finally {
				isLoadingRef.current = false
				setIsLoading(false)
			}
		},
		[
			actionFn,
			errorMessage,
			fetchDelay,
			idCustomFieldForSelectItem,
			limit,
			nameCustomFieldForSelectItem,
			requiredIds,
		],
	)

	React.useEffect(() => {
		if (!initialOptionsSignature) {
			return
		}
		const latest = initialOptionsRef.current ?? []
		setItems((prev) => {
			const mapped = latest.map(projectItem)
			const initialIds = new Set(
				mapped.map((m) => idCustomFieldForSelectItem(m)),
			)
			const rest = prev.filter(
				(p) => !initialIds.has(idCustomFieldForSelectItem(p)),
			)
			return [...mapped, ...rest]
		})
	}, [
		initialOptionsSignature,
		nameCustomFieldForSelectItem,
		idCustomFieldForSelectItem,
	])

	React.useEffect(() => {
		if (!isInitialLoadRef.current) {
			isInitialLoadRef.current = true
			void loadPage(currentPageRef.current)
		}
	}, [loadPage])

	const onLoadMore = React.useCallback((): void => {
		if (!hasMoreRef.current || isLoadingRef.current) {
			return
		}

		const nextPage = currentPageRef.current + 1
		currentPageRef.current = nextPage
		void loadPage(nextPage)
	}, [loadPage])

	return {
		items,
		hasMore,
		isLoading,
		onLoadMore,
	}
}

interface IAsyncSelectListItem {
	id: string
	name: string
}

const AsyncSelectForm = <TSelect, TForm extends Record<string, unknown>>({
	items,
	setScrollContainerRef,
	hasMore,
	isLoading,
	setIsOpen,
	label,
	placeholder,
	name,
	className,
}: {
	items: TSelect[]
	setScrollContainerRef: (node: HTMLDivElement | null) => void
	hasMore: boolean
	isLoading: boolean
	setIsOpen: (value: boolean) => void
	label?: string
	placeholder?: string
	name: Path<TForm>
	className?: string
}) => {
	const { control, trigger } = useFormContext<TForm>()

	const listItems = React.useMemo((): IAsyncSelectListItem[] => {
		return items.map((item) => ({
			id: (item as unknown as { id: string }).id,
			name: (item as unknown as { name: string }).name,
		}))
	}, [items])

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
						validationBehavior='aria'
						isInvalid={!!error}
						value={value ? String(value) : null}
						onChange={(key) => {
							onChange(key != null ? String(key) : null)
							void trigger(name)
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
							<AsyncSelectListBox
								listItems={listItems}
								setScrollContainerRef={setScrollContainerRef}
								hasMore={hasMore}
								isLoading={isLoading}
							/>
						</Select.Popover>
						<FieldError>{error?.message}</FieldError>
					</Select>
				)
			}}
		/>
	)
}

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
	label?: string
	placeholder?: string
	isForm?: boolean
	name?: Path<TForm>
	nameCustomFieldForSelectItem?: (data: TSelect) => string
	idCustomFieldForSelectItem?: (data: TSelect) => string
	value?: string
	onChange?: (value: string | null) => void
	className?: string
}) => {
	const [isOpen, setIsOpen] = React.useState(false)
	const { items, hasMore, isLoading, onLoadMore } = useAsyncGetItems<TSelect>({
		actionFn,
		initialOptions,
		nameCustomFieldForSelectItem,
		requiredIds,
		idCustomFieldForSelectItem,
		errorMessage,
	})

	const listItems = React.useMemo((): IAsyncSelectListItem[] => {
		return items.map((item) => ({
			id: (item as unknown as { id: string }).id,
			name: (item as unknown as { name: string }).name,
		}))
	}, [items])

	const { setScrollContainerRef } = useInfiniteListLoader({
		isOpen,
		hasMore,
		isLoading,
		itemsLength: listItems.length,
		onLoadMore,
	})

	if (isForm && name) {
		return (
			<AsyncSelectForm
				className={className}
				items={items}
				isLoading={isLoading}
				hasMore={hasMore}
				setScrollContainerRef={setScrollContainerRef}
				setIsOpen={setIsOpen}
				label={label}
				placeholder={placeholder}
				name={name}
			/>
		)
	}

	return (
		<Select
			className={className}
			aria-label={label || 'Выбор элемента'}
			placeholder={placeholder || 'Не выбрано'}
			variant='secondary'
			value={value ? String(value) : null}
			fullWidth
			onChange={(key) => {
				if (onChange) {
					onChange(key != null ? String(key) : null)
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
				<AsyncSelectListBox
					listItems={listItems}
					setScrollContainerRef={setScrollContainerRef}
					hasMore={hasMore}
					isLoading={isLoading}
				/>
			</Select.Popover>
		</Select>
	)
}
