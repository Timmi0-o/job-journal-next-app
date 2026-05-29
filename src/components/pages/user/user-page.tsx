'use client';

import { BasePage } from '@/components/shared/components/base-page/base-page';
import { Button } from '@heroui/react';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';
import { FilterBlock } from './components/filter-block/filter-block';
import { IUseRenderUsersTableProps } from './hooks/use-render-users-table/i-render-users-table-props';
import { useRenderUsersTable } from './hooks/use-render-users-table/use-render-users-table';

type IUsersPageProps = IUseRenderUsersTableProps;

export const UsersPage = ({ data }: IUsersPageProps) => {
	const { renderTable } = useRenderUsersTable({ data });

	return (
		<BasePage
			titlePage="Пользователи"
			headerContent={
				<div className="flex items-start gap-2 flex-1 flex-wrap">
					<FilterBlock />
					<Button>
						<Link
							href="/users/create"
							className="no-underline inline-flex items-center gap-2"
						>
							<FaUser /> Создать пользователя
						</Link>
					</Button>
				</div>
			}
		>
			{renderTable}
		</BasePage>
	);
};
