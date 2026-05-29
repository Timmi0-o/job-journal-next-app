'use client';

import { unitsGet } from '@/actions/unit/actions';
import { IUnit } from '@/actions/unit/models/unit.schema';
import { AsyncSelect } from '@/components/shared/ui/async-select/async-select';
import { Path } from 'react-hook-form';

export const SelectUnitSelect = <TForm extends Record<string, unknown>>({
	formKey = 'unitId',
}: {
	formKey?: Path<TForm> | string;
}) => {
	return (
		<AsyncSelect<IUnit, TForm>
			errorMessage="Ошибка загрузки единиц измерения"
			label="Единица измерения"
			placeholder="Выберите единицу"
			actionFn={unitsGet}
			isForm
			name={formKey as Path<TForm>}
			nameCustomFieldForSelectItem={(item) => item.name}
			idCustomFieldForSelectItem={(item) => item.id}
		/>
	);
};
