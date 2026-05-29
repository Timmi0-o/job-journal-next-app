'use client';

import { IJournal } from '@/actions/journal/models/journal.schema';
import { SelectJobVariantSelect } from '@/components/forms/components/select-job-variant-select/select-job-variant-select';
import { SelectUnitSelect } from '@/components/forms/components/select-unit-select/select-unit-select';
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
import { useJournalForm } from '../hooks/use-journal-form';

interface IJournalFormFieldsProps {
	id: string;
}

type IJournalFormValues = IJournal & { endDateLocal: string };

export const JournalFormFields = ({ id }: IJournalFormFieldsProps) => {
	const { control } = useFormContext<IJournalFormValues>();
	const { errors, isSubmitting, isDirty } = useFormState({ control });
	const { handleSubmit: onSubmit } = useJournalForm(id);

	return (
		<BaseForm id="journal-edit-form" onSubmit={onSubmit}>
			<div className="flex gap-4 items-start">
				<div className="flex flex-col gap-4 flex-1 w-full">
					<SelectJobVariantSelect<IJournalFormValues> />
					<SelectUnitSelect<IJournalFormValues> />
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
						name="endDateLocal"
						control={control}
						render={({ field }) => (
							<TextField
								isInvalid={!!errors.endDateLocal}
								isDisabled={isSubmitting}
							>
								<Label>Дата окончания</Label>
								<Input type="datetime-local" {...bindRhfTextField(field)} />
								<FieldError>{errors.endDateLocal?.message}</FieldError>
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
