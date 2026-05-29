'use client';

import { BasePage } from '@/components/shared/components/base-page/base-page';
import { Button, Dropdown, Header, Label } from '@heroui/react';
import Link from 'next/link';
import { IoIosAddCircle } from 'react-icons/io';
import { CgMenuGridO } from 'react-icons/cg';
import { FilterBlock } from './components/filter-block/filter-block';
import { IUseRenderUnitsTableProps } from './hooks/use-render-units-table/i-render-units-table-props';
import { useRenderUnitsTable } from './hooks/use-render-units-table/use-render-units-table';

type IUnitsPageProps = IUseRenderUnitsTableProps;

export const UnitsPage = ({ data }: IUnitsPageProps) => {
	const { renderTable } = useRenderUnitsTable({ data });

	return (
		<BasePage
			titlePage="Единицы измерения"
			breadcrumbs={[{ label: 'Единицы измерения', href: '/units' }]}
			headerContent={
				<div className="flex items-center gap-3 flex-wrap justify-end min-w-0 max-w-full flex-1">
					<FilterBlock />
					<Dropdown>
						<Button size="sm" aria-label="Опции">
							<CgMenuGridO size={20} /> Опции
						</Button>
						<Dropdown.Popover>
							<Dropdown.Menu>
								<Dropdown.Section>
									<Header>Основные</Header>
									<Dropdown.Item href="/units/create" key="create">
										<IoIosAddCircle size={16} />
										<Label>Добавить единицу</Label>
									</Dropdown.Item>
								</Dropdown.Section>
							</Dropdown.Menu>
						</Dropdown.Popover>
					</Dropdown>
				</div>
			}
		>
			{renderTable}
		</BasePage>
	);
};
