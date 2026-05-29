'use client';

import { IUser } from '@/actions/user/models/user.schema';
import {
	EUserRole,
	EUserRolesColorMap,
	EUserRolesRu,
	EUserStatus,
	EUserStatusColorMap,
	EUserStatusRu,
} from '@/enums/user.enum';
import { FormatDate } from '@/utils/format-date.util';
import { Button, Chip, Tooltip, toast } from '@heroui/react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { IUserColumnKeys, USER_COLUMNS } from './data/user-columns';

export const useRenderUsersCell = () => {
	const renderCell = (
		user: IUser,
		columnKey: IUserColumnKeys
	): ReactNode => {
		switch (columnKey) {
			case 'id': {
				const id = user.id;
				return (
					<Tooltip delay={0}>
						<Tooltip.Trigger>
							<div>{id.slice(0, 8)}</div>
						</Tooltip.Trigger>
						<Tooltip.Content placement="bottom">
							<span
								className="text-xs text-gray-500 cursor-pointer"
								onClick={() => {
									window.navigator.clipboard.writeText(id);
									toast('ID скопирован в буфер обмена');
								}}
							>
								{id}
							</span>
						</Tooltip.Content>
					</Tooltip>
				);
			}
			case 'name': {
				const { name, surname, patronymic } = user;
				return (
					<span>
						{surname} {name} {patronymic ? ` ${patronymic}` : ''}
					</span>
				);
			}
			case 'email':
				return <span>{user.email}</span>;
			case 'role': {
				const role = user.role;
				return (
					<Chip
						size="sm"
						variant="soft"
						color={EUserRolesColorMap[role as EUserRole]}
					>
						{EUserRolesRu[role as EUserRole]}
					</Chip>
				);
			}
			case 'status': {
				const status = user.status;
				return (
					<Chip
						size="sm"
						variant="soft"
						color={EUserStatusColorMap[status as EUserStatus]}
					>
						{EUserStatusRu[status as EUserStatus]}
					</Chip>
				);
			}
			case 'createdAt':
				return <div>{FormatDate(new Date(user.createdAt))}</div>;
			case 'updatedAt':
				return <div>{FormatDate(new Date(user.updatedAt))}</div>;
			case 'actions':
				return (
					<div className="flex items-center gap-1">
						<Tooltip delay={0}>
							<Tooltip.Trigger>
								<Button isIconOnly variant="tertiary" size="sm">
									<Link
										className="size-full flex items-center justify-center"
										href={`/users/edit/${user.id}`}
									>
										<FiEdit2 size={18} />
									</Link>
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content offset={10} placement="bottom">
								Редактировать
							</Tooltip.Content>
						</Tooltip>
					</div>
				);
			default:
				return <div>{String(user[columnKey as keyof IUser] ?? '-')}</div>;
		}
	};

	return {
		columns: USER_COLUMNS,
		renderCell,
	};
};
