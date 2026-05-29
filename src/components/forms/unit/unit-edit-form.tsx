'use client';

import { IUnit, UnitSchema } from '@/actions/unit/models/unit.schema';
import { FormTabs } from '@/components/forms/ui/form-tabs/form-tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { UnitFormFields } from './ui/unit-form-fields';

interface IUnitEditFormProps {
	data: IUnit;
	id: string;
}

export const UnitEditForm = ({ data, id }: IUnitEditFormProps) => {
	const unitForm = useForm({
		resolver: zodResolver(UnitSchema),
		defaultValues: data,
	});

	const tabs = useMemo(
		() => [
			{
				name: 'Главная информация',
				key: 'main',
				component: (
					<FormProvider {...unitForm}>
						<UnitFormFields id={id} />
					</FormProvider>
				),
			},
		],
		[unitForm, id]
	);

	return <FormTabs tabs={tabs} />;
};
