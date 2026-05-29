'use client';

import { BasePage } from '@/components/shared/components/base-page/base-page';
import { Button, Dropdown, Header, Label } from '@heroui/react';
import { IoIosAddCircle } from 'react-icons/io';
import { CgMenuGridO } from 'react-icons/cg';
import { FilterBlock } from './components/filter-block/filter-block';
import { IUseRenderJournalsTableProps } from './hooks/use-render-journals-table/i-render-journals-table-props';
import { useRenderJournalsTable } from './hooks/use-render-journals-table/use-render-journals-table';

type IJournalsPageProps = IUseRenderJournalsTableProps;

export const JournalsPage = ({ data }: IJournalsPageProps) => {
	const { renderTable } = useRenderJournalsTable({ data });

	return (
		<BasePage
			titlePage="Записи журнала"
			breadcrumbs={[{ label: 'Записи журнала', href: '/journals' }]}
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
									<Dropdown.Item href="/journals/create" key="create">
										<IoIosAddCircle size={16} />
										<Label>Добавить запись</Label>
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
