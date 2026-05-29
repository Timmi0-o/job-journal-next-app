'use client';

import { jobVariantsGet } from '@/actions/job-variant/actions';
import { IJobVariant } from '@/actions/job-variant/models/job-variant.schema';
import { AsyncSelect } from '@/components/shared/ui/async-select/async-select';
import { Path } from 'react-hook-form';

export const SelectJobVariantSelect = <TForm extends Record<string, unknown>>({
	formKey = 'jobVariantId',
}: {
	formKey?: Path<TForm> | string;
}) => {
	return (
		<AsyncSelect<IJobVariant, TForm>
			errorMessage="Ошибка загрузки видов работ"
			label="Вид работы"
			placeholder="Выберите вид работы"
			actionFn={jobVariantsGet}
			isForm
			name={formKey as Path<TForm>}
			nameCustomFieldForSelectItem={(item) => item.name}
			idCustomFieldForSelectItem={(item) => item.id}
		/>
	);
};
