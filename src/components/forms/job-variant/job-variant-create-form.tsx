'use client';

import { jobVariantsCreate } from '@/actions/job-variant/actions';
import {
	IJobVariantCreate,
	JobVariantCreateSchema,
} from '@/actions/job-variant/models/job-variant-create.schema';
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

export const JobVariantCreateForm = () => {
	const router = useRouter();

	const jobVariantForm = useForm<IJobVariantCreate>({
		resolver: zodResolver(JobVariantCreateSchema),
		defaultValues: {
			name: '',
		},
	});

	const {
		control,
		formState: { errors, isSubmitting, isDirty },
	} = jobVariantForm;

	const onSubmit = async (data: IJobVariantCreate) => {
		const validatedData = JobVariantCreateSchema.safeParse(data);

		if (!validatedData.success) {
			return toast.danger('Ошибка в данных', {
				description: validatedData.error.message,
			});
		}

		const res = await jobVariantsCreate({
			params: {
				body: validatedData.data,
			},
		});

		if (res?.error) {
			return toast.danger('Ошибка', { description: res.error.message });
		}

		toast('Вид работы успешно создан');
		router.back();
	};

	const tabs = useMemo(
		() => [
			{
				name: 'Главная информация',
				key: 'main',
				component: (
					<Controller
						name="name"
						control={control}
						render={({ field }) => (
							<TextField isInvalid={!!errors.name} isDisabled={isSubmitting}>
								<Label>Название</Label>
								<Input placeholder="Название" {...bindRhfTextField(field)} />
								<FieldError>{errors.name?.message}</FieldError>
							</TextField>
						)}
					/>
				),
			},
		],
		[control, errors, isSubmitting]
	);

	return (
		<FormProvider {...jobVariantForm}>
			<BaseForm id="job-variant-create-form" onSubmit={onSubmit}>
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
