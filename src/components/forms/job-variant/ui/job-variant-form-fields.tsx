'use client';

import { IJobVariant } from '@/actions/job-variant/models/job-variant.schema';
import { FormActionBar } from '@/components/forms/components/action-bars/form-action-bar';
import { BaseForm } from '@/components/forms/components/base-form/base-form';
import { bindRhfTextField } from '@/utils/rhf-heroui-field.util';
import {
	FieldError,
	Input,
	Label,
	TextField,
} from '@heroui/react';
import { Controller, useFormContext, useFormState } from 'react-hook-form';
import { FaSave } from 'react-icons/fa';
import { useJobVariantForm } from '../hooks/use-job-variant-form';

interface IJobVariantFormFieldsProps {
	id: string;
}

export const JobVariantFormFields = ({ id }: IJobVariantFormFieldsProps) => {
	const { control } = useFormContext<IJobVariant>();
	const { errors, isSubmitting, isDirty } = useFormState({ control });
	const { handleSubmit: onSubmit } = useJobVariantForm(id);

	return (
		<BaseForm id="job-variant-edit-form" onSubmit={onSubmit}>
			<div className="flex gap-4 items-start">
				<div className="flex flex-col gap-2 flex-1 w-full">
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
				</div>
				<FormActionBar
					primaryIcon={<FaSave />}
					hintText="Проверьте данные перед отправкой"
					isDisabled={!isDirty}
					secondaryAction={{
						label: 'Назад',
						onClick: () => history.back(),
					}}
				/>
			</div>
		</BaseForm>
	);
};
