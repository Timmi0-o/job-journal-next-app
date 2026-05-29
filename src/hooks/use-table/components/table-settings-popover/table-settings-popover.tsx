'use client';

import { useManageSearchParams } from '@/hooks/use-manage-search-params';
import {
	Button,
	Checkbox,
	CheckboxGroup,
	Label,
	ListBox,
	Popover,
	Select,
	Separator,
} from '@heroui/react';
import { CheckboxContext } from 'react-aria-components';
import { IoIosArrowUp } from 'react-icons/io';
import { IoSettingsSharp } from 'react-icons/io5';
import { ITableSettingsPopoverProps } from './i-types';

export const TableSettingsPopover = ({
	columns,
	visibleColumns,
	rowsPerPage,
	totalCount,
	selectedCount,
	onVisibleColumnsChange,
}: ITableSettingsPopoverProps) => {
	const { handlePushKeyInSearchParams } = useManageSearchParams();

	const visibleColumnsArray =
		visibleColumns === 'all'
			? columns.map((c) => c.name.toLowerCase())
			: visibleColumns === 'none'
				? []
				: Array.from(visibleColumns);

	const handleColumnToggle = (values: string[]) => {
		if (values.length === 0) {
			onVisibleColumnsChange('none');
		} else if (values.length === columns.length) {
			onVisibleColumnsChange(new Set(columns.map((c) => c.name.toLowerCase())));
		} else {
			onVisibleColumnsChange(new Set(values));
		}
	};

	const handleSelectAll = () => {
		onVisibleColumnsChange(new Set(columns.map((c) => c.name.toLowerCase())));
	};

	const handleDeselectAll = () => {
		onVisibleColumnsChange('none');
	};

	const handleLimitChange = (limit: number | string): void => {
		handlePushKeyInSearchParams({ key: 'limit', value: limit });
	};

	return (
		<Popover>
			<Button isIconOnly variant="ghost" size="sm" className="min-w-6 w-6 h-6">
				<IoSettingsSharp className="text-muted" size={16} />
			</Button>
			<Popover.Content
				placement="bottom end"
				className="min-w-[280px] rounded-[28px] bg-background dark:bg-zinc-900 dark:border-white/10 border-transparent border drop-shadow-lg drop-shadow-black/10 dark:drop-shadow-zinc-500/10"
			>
				<Popover.Dialog className="outline-none">
					<div className="flex flex-col gap-3">
						{/* Header */}
						<div className="flex items-center justify-between">
							<h4 className="text-sm font-semibold text-foreground">
								Настройки таблицы
							</h4>
						</div>

						{/* Stats */}
						<div className="flex items-center gap-3 text-xs text-muted">
							<span>Всего: {totalCount}</span>
							<span>•</span>
							<span>Выбрано: {selectedCount}</span>
						</div>

						<Separator />

						{/* Rows per page */}
						<div className="flex flex-col gap-2">
							<label
								id="table-rows-per-page-label"
								className="text-xs font-medium text-foreground"
							>
								Элементов на странице
							</label>
							<div className="flex items-center gap-1 justify-between">
								<Select
									aria-labelledby="table-rows-per-page-label"
									value={String(rowsPerPage)}
									onChange={(key) => {
										if (key != null) {
											handleLimitChange(String(key));
										}
									}}
									variant="secondary"
								>
									<Select.Trigger className="h-8 max-w-[180px] min-w-[160px]">
										<Select.Value />
										<Select.Indicator />
									</Select.Trigger>
									<Select.Popover>
										<ListBox>
											{[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((num) => (
												<ListBox.Item
													key={num}
													id={String(num)}
													textValue={`${num} элементов`}
												>
													{num} элементов
													<ListBox.ItemIndicator />
												</ListBox.Item>
											))}
										</ListBox>
									</Select.Popover>
								</Select>
								<div className="flex items-center justify-around w-full">
									<Button
										onPress={() => handleLimitChange(String(+rowsPerPage + 5))}
										isIconOnly
										size="sm"
										variant="tertiary"
									>
										<IoIosArrowUp />
									</Button>
									<Button
										onPress={() => handleLimitChange(String(+rowsPerPage - 5))}
										isIconOnly
										size="sm"
										variant="tertiary"
									>
										<IoIosArrowUp className="rotate-180" />
									</Button>
								</div>
							</div>
						</div>

						<Separator />

						{/* Columns visibility */}
						<div className="flex flex-col gap-2 max-w-[250px]">
							<div className="flex items-center justify-between">
								<label className="text-xs font-medium text-foreground">
									Видимые колонки
								</label>
								<div className="flex gap-1">
									<Button
										size="sm"
										variant="ghost"
										className="h-6 px-2 text-xs min-w-0"
										onPress={handleSelectAll}
									>
										Все
									</Button>
									<Button
										size="sm"
										variant="ghost"
										className="h-6 px-2 text-xs min-w-0"
										onPress={handleDeselectAll}
									>
										Сбросить
									</Button>
								</div>
							</div>

							<CheckboxContext.Provider value={{}}>
								<CheckboxGroup
									name="table-visible-columns"
									value={visibleColumnsArray}
									onChange={handleColumnToggle}
								>
									<div className="flex flex-wrap gap-x-2">
										{columns.map((column) => (
											<Checkbox
												key={column.uid}
												value={column.name.toLowerCase()}
												className="text-xs mt-0! mb-[6px]!"
											>
												<Checkbox.Control>
													<Checkbox.Indicator />
												</Checkbox.Control>
												<Checkbox.Content>
													<Label className="text-xs">{column.name}</Label>
												</Checkbox.Content>
											</Checkbox>
										))}
									</div>
								</CheckboxGroup>
							</CheckboxContext.Provider>
						</div>
					</div>
				</Popover.Dialog>
			</Popover.Content>
		</Popover>
	);
};
