'use client';

import { unitsCreate } from '@/actions/unit/actions';
import {
	IUnitCreate,
	UnitCreateSchema,
} from '@/actions/unit/models/unit-create.schema';
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

export const UnitCreateForm = () => {
	const router = useRouter();

	const unitForm = useForm<IUnitCreate>({
		resolver: zodResolver(UnitCreateSchema),
		defaultValues: {
			name: '',
		},
	});

	const {
		control,
		formState: { errors, isSubmitting, isDirty },
	} = unitForm;

	const onSubmit = async (data: IUnitCreate) => {
		const validatedData = UnitCreateSchema.safeParse(data);

		if (!validatedData.success) {
			return toast.danger('Ошибка в данных', {
				description: validatedData.error.message,
			});
		}

		const res = await unitsCreate({
			params: {
				body: validatedData.data,
			},
		});

		if (res?.error) {
			return toast.danger('Ошибка', { description: res.error.message });
		}

		toast('Единица измерения успешно создана');
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
		<FormProvider {...unitForm}>
			<BaseForm id="unit-create-form" className="flex-row" onSubmit={onSubmit}>
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
