'use client';

import { BasePage } from '@/components/shared/components/base-page/base-page';
import { Button, Dropdown, Header, Label } from '@heroui/react';
import { IoIosAddCircle } from 'react-icons/io';
import { CgMenuGridO } from 'react-icons/cg';
import { FilterBlock } from './components/filter-block/filter-block';
import { IUseRenderJobVariantsTableProps } from './hooks/use-render-job-variants-table/i-render-job-variants-table-props';
import { useRenderJobVariantsTable } from './hooks/use-render-job-variants-table/use-render-job-variants-table';

type IJobVariantsPageProps = IUseRenderJobVariantsTableProps;

export const JobVariantsPage = ({ data }: IJobVariantsPageProps) => {
	const { renderTable } = useRenderJobVariantsTable({ data });

	return (
		<BasePage
			titlePage="Виды работ"
			breadcrumbs={[{ label: 'Виды работ', href: '/job-variants' }]}
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
									<Dropdown.Item href="/job-variants/create" key="create">
										<IoIosAddCircle size={16} />
										<Label>Добавить вид работы</Label>
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
