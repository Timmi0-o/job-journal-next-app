'use client';

import {
	IJobVariant,
	JobVariantSchema,
} from '@/actions/job-variant/models/job-variant.schema';
import { FormTabs } from '@/components/forms/ui/form-tabs/form-tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { JobVariantFormFields } from './ui/job-variant-form-fields';

interface IJobVariantEditFormProps {
	data: IJobVariant;
	id: string;
}

export const JobVariantEditForm = ({ data, id }: IJobVariantEditFormProps) => {
	const jobVariantForm = useForm({
		resolver: zodResolver(JobVariantSchema),
		defaultValues: data,
	});

	const tabs = useMemo(
		() => [
			{
				name: 'Главная информация',
				key: 'main',
				component: (
					<FormProvider {...jobVariantForm}>
						<JobVariantFormFields id={id} />
					</FormProvider>
				),
			},
		],
		[jobVariantForm, id]
	);

	return <FormTabs tabs={tabs} />;
};
