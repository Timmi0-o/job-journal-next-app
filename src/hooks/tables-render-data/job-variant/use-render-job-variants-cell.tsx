'use client';

import { IJobVariant } from '@/actions/job-variant/models/job-variant.schema';
import { FormatDate } from '@/utils/format-date.util';
import { Button, Tooltip, toast } from '@heroui/react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import {
	IJobVariantColumnKeys,
	JOB_VARIANT_COLUMNS,
} from './data/job-variant-columns';

export const useRenderJobVariantsCell = () => {
	const renderCell = (
		jobVariant: IJobVariant,
		columnKey: IJobVariantColumnKeys
	): ReactNode => {
		switch (columnKey) {
			case 'id': {
				const id = jobVariant.id;
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
				return <span>{jobVariant.name}</span>;
			case 'createdAt':
				return <div>{FormatDate(new Date(jobVariant.createdAt))}</div>;
			case 'updatedAt':
				return <div>{FormatDate(new Date(jobVariant.updatedAt))}</div>;
			case 'actions':
				return (
					<div className="flex items-center gap-1">
						<Tooltip delay={0}>
							<Tooltip.Trigger>
								<Button isIconOnly variant="tertiary" size="sm">
									<Link
										className="size-full flex items-center justify-center"
										href={`/job-variants/edit/${jobVariant.id}`}
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
				return (
					<div>{String(jobVariant[columnKey as keyof IJobVariant] ?? '-')}</div>
				);
		}
	};

	return {
		columns: JOB_VARIANT_COLUMNS,
		renderCell,
	};
};
