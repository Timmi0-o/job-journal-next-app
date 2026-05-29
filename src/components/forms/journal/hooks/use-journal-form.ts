'use client';

import { journalsEdit } from '@/actions/journal/actions';
import {
	IJournalEdit,
	JournalEditSchema,
} from '@/actions/journal/models/journal-edit.schema';
import { IJournal } from '@/actions/journal/models/journal.schema';
import { toast } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { fromDatetimeLocal } from '../utils/datetime-local.util';

export const useJournalForm = (id: string) => {
	const router = useRouter();

	const handleSubmit = useCallback(
		async (data: IJournal & { endDateLocal?: string }) => {
			const endDateValue =
				data.endDateLocal != null && data.endDateLocal !== ''
					? fromDatetimeLocal(data.endDateLocal)
					: data.endDate;

			const dataToSend: IJournalEdit = {
				id,
				jobVariantId: data.jobVariantId,
				unitId: data.unitId,
				amount: data.amount,
				endDate: endDateValue,
			};

			const validatedData = JournalEditSchema.safeParse(dataToSend);

			if (!validatedData.success) {
				return toast.danger('Ошибка в данных', {
					description: validatedData.error.message,
				});
			}

			const { error } = await journalsEdit({
				params: {
					body: validatedData.data,
				},
			});

			if (error?.message) {
				toast.danger('Ошибка', { description: error.message });
				return;
			}

			toast('Запись журнала успешно обновлена');
			router.back();
		},
		[id, router]
	);

	return {
		handleSubmit: handleSubmit as SubmitHandler<IJournal & { endDateLocal?: string }>,
	};
};
