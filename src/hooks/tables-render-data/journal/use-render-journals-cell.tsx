'use client';

import { IJournal } from '@/actions/journal/models/journal.schema';
import { FormatDate } from '@/utils/format-date.util';
import { Button, Tooltip, toast } from '@heroui/react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { IJournalColumnKeys, JOURNAL_COLUMNS } from './data/journal-columns';

export const useRenderJournalsCell = () => {
	const renderCell = (
		journal: IJournal,
		columnKey: IJournalColumnKeys
	): ReactNode => {
		switch (columnKey) {
			case 'id': {
				const id = journal.id;
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
			case 'jobVariantId':
				return <span>{journal.jobVariantId}</span>;
			case 'amount':
				return <span>{journal.amount}</span>;
			case 'unitId':
				return <span>{journal.unitId}</span>;
			case 'endDate':
				return <div>{FormatDate(new Date(journal.endDate))}</div>;
			case 'createdAt':
				return <div>{FormatDate(new Date(journal.createdAt))}</div>;
			case 'actions':
				return (
					<div className="flex items-center gap-1">
						<Tooltip delay={0}>
							<Tooltip.Trigger>
								<Button isIconOnly variant="tertiary" size="sm">
									<Link
										className="size-full flex items-center justify-center"
										href={`/journals/edit/${journal.id}`}
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
				return <div>{String(journal[columnKey as keyof IJournal] ?? '-')}</div>;
		}
	};

	return {
		columns: JOURNAL_COLUMNS,
		renderCell,
	};
};
