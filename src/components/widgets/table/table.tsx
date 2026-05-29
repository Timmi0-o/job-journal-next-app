'use client';

import { TableDataNotFound } from '@/components/widgets/table/components/data-not-found';
import { LoadingTableDataBlock } from '@/components/widgets/table/components/loading-table-data-block/loading-table-data-block';
import { TableSettingsPopover } from '@/hooks/use-table/components/table-settings-popover/table-settings-popover';
import { getValueByPrefix } from '@/utils/get-value-by-prefix.util';
import {
	Table as HerouiTable,
	Pagination,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@heroui/react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useGetMaxTableWidth } from './hooks/use-get-max-table-width';
import styles from './table.module.css';
import { ITableProps } from './types/i-table-props';
import { getPaginationVisiblePages } from './utils/get-pagination-visible-pages';

const getRowSelectionKey = <T,>(
	item: T & { id: number | string },
	idRowPrefix?: string
): string => {
	if (idRowPrefix) {
		const fromPrefix = getValueByPrefix(item, idRowPrefix);
		const valueUnknown: unknown = fromPrefix?.value;
		if (valueUnknown && typeof valueUnknown === 'object' && 'id' in valueUnknown) {
			const idRaw = (valueUnknown as { id: unknown }).id;
			if (idRaw !== undefined && idRaw !== null) {
				return String(idRaw);
			}
		}
	}
	return String(item.id);
};

const TableComponent = <T,>({
	data,
	selectedKeys,
	setSelectedKeys,
	idRowPrefix,
	rowsPerPage,
	page,
	handlePageChange,
	headerColumns,
	columns,
	visibleColumns,
	setVisibleColumns,
	renderCell,
	pages,
	isLoading,
	...props
}: ITableProps<T>) => {
	const maxWidth = useGetMaxTableWidth();

	const firstRowHeaderColumnUid = useMemo((): string | undefined => {
		const dataColumn = headerColumns.find((column) => column.uid !== '__settings__');
		return dataColumn?.uid ?? headerColumns[0]?.uid;
	}, [headerColumns]);

	const limit = +rowsPerPage;
	const paginationSummary = useMemo((): string => {
		if (data.count === 0) {
			return 'Нет записей';
		}
		const from = (page - 1) * limit + 1;
		const to = Math.min(page * limit, data.count);
		return `Показано ${from}–${to} из ${data.count}`;
	}, [data.count, limit, page]);

	const visiblePaginationSlots = useMemo(
		() => getPaginationVisiblePages(page, pages),
		[page, pages]
	);

	const rows = (
		(data.rows as unknown as (T & { id: number | string })[]) || []
	).slice(0, +rowsPerPage);

	return (
		<>
			<div
				className={styles.table_wrapper}
				style={{
					maxWidth,
				}}
			>
				<HerouiTable {...props} className={clsx(props.className)}>
					<HerouiTable.ScrollContainer>
						<HerouiTable.Content
							aria-label="Table"
							selectedKeys={selectedKeys ?? new Set()}
							onSelectionChange={(keys) => {
								if (keys === 'all') {
									setSelectedKeys(
										new Set(
											(
												data.rows as unknown as (T & {
													id: number | string;
												})[]
											).map((row) => {
												return getRowSelectionKey(row, idRowPrefix);
											})
										)
									);
								} else {
									setSelectedKeys(keys as Set<string>);
								}
							}}
							selectionMode="none"
						>
							<TableHeader>
								{headerColumns.map((column) => (
									<TableColumn
										key={column.uid}
										className={clsx(
											column.uid === 'actions' || column.uid === '__settings__'
												? 'text-center'
												: 'text-start',
											column.uid === '__settings__' && 'min-w-[50px] w-[50px]'
										)}
										isRowHeader={column.uid === firstRowHeaderColumnUid}
										allowsSorting={column.sortable}
									>
										{column.uid === '__settings__' ? (
											<TableSettingsPopover
												columns={columns}
												visibleColumns={visibleColumns}
												rowsPerPage={rowsPerPage}
												totalCount={data.count}
												selectedCount={Array.from(selectedKeys || []).length}
												onVisibleColumnsChange={setVisibleColumns}
											/>
										) : (
											column.name
										)}
									</TableColumn>
								))}
							</TableHeader>
							<TableBody
								renderEmptyState={
									isLoading
										? () => (
												<div className="w-full min-w-0">
													<LoadingTableDataBlock />
												</div>
											)
										: () => (
												<div className="w-full min-w-0">
													<TableDataNotFound />
												</div>
											)
								}
							>
								{rows.map((item, index) => {
									const rowKey = getRowSelectionKey(item, idRowPrefix);
									return (
										<TableRow key={rowKey} id={rowKey}>
											{headerColumns.map((column, columnIndex) => (
												<TableCell key={column.uid}>
													<div className="relative">
														{columnIndex === 0 ? (
															<span className="text-[9px] text-gray-300 dark:text-gray-700 absolute -top-3.5 -left-2.5">
																{index + 1}
															</span>
														) : null}
														{column.uid === '__settings__'
															? null
															: renderCell(item, column.uid as keyof T)}
													</div>
												</TableCell>
											))}
										</TableRow>
									);
								})}
							</TableBody>
						</HerouiTable.Content>
					</HerouiTable.ScrollContainer>
				</HerouiTable>
			</div>
			{data.count > +rowsPerPage &&
				typeof document !== 'undefined' &&
				createPortal(
					<div className="fixed lg:bottom-5 bottom-[100px] left-[50%] translate-x-[-50%] z-10 w-fit flex justify-center rounded-[22px] backdrop-blur-sm p-2">
						<Pagination size="sm" className="flex flex-col items-center gap-2">
							<Pagination.Summary className="text-[12px] text-gray-500 whitespace-nowrap px-1">
								{paginationSummary}
							</Pagination.Summary>
							<Pagination.Content>
								<Pagination.Item>
									<Pagination.Previous
										isDisabled={page <= 1}
										onPress={() => {
											handlePageChange(page - 1);
										}}
									>
										<Pagination.PreviousIcon />
										<span>Назад</span>
									</Pagination.Previous>
								</Pagination.Item>
								{visiblePaginationSlots.map((slot, slotIndex) => (
									<Pagination.Item
										key={
											slot === 'ellipsis' ? `ellipsis-${slotIndex}` : `page-${slot}`
										}
									>
										{slot === 'ellipsis' ? (
											<Pagination.Ellipsis />
										) : (
											<Pagination.Link
												isActive={slot === page}
												onPress={() => {
													handlePageChange(slot);
												}}
											>
												{slot}
											</Pagination.Link>
										)}
									</Pagination.Item>
								))}
								<Pagination.Item>
									<Pagination.Next
										isDisabled={page >= pages}
										onPress={() => {
											handlePageChange(page + 1);
										}}
									>
										<span>Далее</span>
										<Pagination.NextIcon />
									</Pagination.Next>
								</Pagination.Item>
							</Pagination.Content>
						</Pagination>
					</div>,
					document.body
				)}
		</>
	);
};

export const Table = observer(TableComponent);
