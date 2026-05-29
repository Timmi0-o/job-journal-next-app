'use client';

import { UnitCreateForm } from '@/components/forms/unit/unit-create-form';
import { BasePage } from '@/components/shared/components/base-page/base-page';

export const UnitCreatePage = () => {
	return (
		<BasePage titlePage="Создание единицы измерения">
			<UnitCreateForm />
		</BasePage>
	);
};
