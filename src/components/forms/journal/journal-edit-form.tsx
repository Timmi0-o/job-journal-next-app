'use client';

import { IJournal } from '@/actions/journal/models/journal.schema';
import { FormTabs } from '@/components/forms/ui/form-tabs/form-tabs';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toDatetimeLocal } from './utils/datetime-local.util';
import { JournalFormFields } from './ui/journal-form-fields';

interface IJournalEditFormProps {
	data: IJournal;
	id: string;
}

type IJournalFormValues = IJournal & { endDateLocal: string };

export const JournalEditForm = ({ data, id }: IJournalEditFormProps) => {
	const journalForm = useForm<IJournalFormValues>({
		defaultValues: {
			...data,
			endDateLocal: toDatetimeLocal(data.endDate),
		},
	});

	const tabs = useMemo(
		() => [
			{
				name: 'Главная информация',
				key: 'main',
				component: (
					<FormProvider {...journalForm}>
						<JournalFormFields id={id} />
					</FormProvider>
				),
			},
		],
		[journalForm, id]
	);

	return <FormTabs tabs={tabs} />;
};
