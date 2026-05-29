'use client';

import { JournalCreateForm } from '@/components/forms/journal/journal-create-form';
import { BasePage } from '@/components/shared/components/base-page/base-page';

export const JournalCreatePage = () => {
	return (
		<BasePage titlePage="Создание записи журнала">
			<JournalCreateForm />
		</BasePage>
	);
};
