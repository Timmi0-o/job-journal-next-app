'use client';

import { IUnit } from '@/actions/unit/models/unit.schema';
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
import { useUnitForm } from '../hooks/use-unit-form';

interface IUnitFormFieldsProps {
	id: string;
}

export const UnitFormFields = ({ id }: IUnitFormFieldsProps) => {
	const { control } = useFormContext<IUnit>();
	const { errors, isSubmitting, isDirty } = useFormState({ control });
	const { handleSubmit: onSubmit } = useUnitForm(id);

	return (
		<BaseForm id="unit-edit-form" className="flex-row" onSubmit={onSubmit}>
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
