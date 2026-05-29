'use client';

import { journalsCreate } from '@/actions/journal/actions';
import {
	IJournalCreate,
	JournalCreateSchema,
} from '@/actions/journal/models/journal-create.schema';
import { SelectJobVariantSelect } from '@/components/forms/components/select-job-variant-select/select-job-variant-select';
import { SelectUnitSelect } from '@/components/forms/components/select-unit-select/select-unit-select';
import { FormActionBar } from '@/components/forms/components/action-bars/form-action-bar';
import { BaseForm } from '@/components/forms/components/base-form/base-form';
import { FormTabs } from '@/components/forms/ui/form-tabs/form-tabs';
import { bindRhfTextField } from '@/utils/rhf-heroui-field.util';
import {
	FieldError,
	Input,
	Label,
	TextField,
	toast,
} from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { FaSave } from 'react-icons/fa';
import { fromDatetimeLocal } from './utils/datetime-local.util';

export const JournalCreateForm = () => {
	const router = useRouter();

	const journalForm = useForm<IJournalCreate>({
		resolver: zodResolver(JournalCreateSchema),
		defaultValues: {
			jobVariantId: '',
			unitId: '',
			amount: '',
			endDate: '',
		},
	});

	const {
		control,
		formState: { errors, isSubmitting, isDirty },
	} = journalForm;

	const onSubmit = async (data: IJournalCreate) => {
		const payload: IJournalCreate = {
			...data,
			endDate: fromDatetimeLocal(data.endDate),
		};

		const validatedData = JournalCreateSchema.safeParse(payload);

		if (!validatedData.success) {
			return toast.danger('Ошибка в данных', {
				description: validatedData.error.message,
			});
		}

		const res = await journalsCreate({
			params: {
				body: validatedData.data,
			},
		});

		if (res?.error) {
			return toast.danger('Ошибка', { description: res.error.message });
		}

		toast('Запись журнала успешно создана');
		router.back();
	};

	const tabs = useMemo(
		() => [
			{
				name: 'Главная информация',
				key: 'main',
				component: (
					<div className="flex flex-col gap-4 flex-1 w-full">
						<SelectJobVariantSelect<IJournalCreate> />
						<SelectUnitSelect<IJournalCreate> />
						<Controller
							name="amount"
							control={control}
							render={({ field }) => (
								<TextField isInvalid={!!errors.amount} isDisabled={isSubmitting}>
									<Label>Количество</Label>
									<Input placeholder="0" {...bindRhfTextField(field)} />
									<FieldError>{errors.amount?.message}</FieldError>
								</TextField>
							)}
						/>
						<Controller
							name="endDate"
							control={control}
							render={({ field }) => (
								<TextField isInvalid={!!errors.endDate} isDisabled={isSubmitting}>
									<Label>Дата окончания</Label>
									<Input type="datetime-local" {...bindRhfTextField(field)} />
									<FieldError>{errors.endDate?.message}</FieldError>
								</TextField>
							)}
						/>
					</div>
				),
			},
		],
		[control, errors, isSubmitting]
	);

	return (
		<FormProvider {...journalForm}>
			<BaseForm id="journal-create-form" className="flex-row" onSubmit={onSubmit}>
				<FormTabs tabs={tabs} />
				<FormActionBar
					primaryIcon={<FaSave />}
					hintText="Проверьте данные и нажмите Сохранить"
					isDisabled={!isDirty}
					secondaryAction={{
						label: 'Назад',
						onClick: () => router.back(),
					}}
				/>
			</BaseForm>
		</FormProvider>
	);
};
