'use client';

import { IUnit } from '@/actions/unit/models/unit.schema';
import { FormatDate } from '@/utils/format-date.util';
import { Button, Tooltip, toast } from '@heroui/react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { IUnitColumnKeys, UNIT_COLUMNS } from './data/unit-columns';

export const useRenderUnitsCell = () => {
	const renderCell = (
		unit: IUnit,
		columnKey: IUnitColumnKeys
	): ReactNode => {
		switch (columnKey) {
			case 'id': {
				const id = unit.id;
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
			case 'name':
				return <span>{unit.name}</span>;
			case 'createdAt':
				return <div>{FormatDate(new Date(unit.createdAt))}</div>;
			case 'updatedAt':
				return <div>{FormatDate(new Date(unit.updatedAt))}</div>;
			case 'actions':
				return (
					<div className="flex items-center gap-1">
						<Tooltip delay={0}>
							<Tooltip.Trigger>
								<Button isIconOnly variant="tertiary" size="sm">
									<Link
										className="size-full flex items-center justify-center"
										href={`/units/edit/${unit.id}`}
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
				return <div>{String(unit[columnKey as keyof IUnit] ?? '-')}</div>;
		}
	};

	return {
		columns: UNIT_COLUMNS,
		renderCell,
	};
};
