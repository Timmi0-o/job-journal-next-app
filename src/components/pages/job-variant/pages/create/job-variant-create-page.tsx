'use client';

import { JobVariantCreateForm } from '@/components/forms/job-variant/job-variant-create-form';
import { BasePage } from '@/components/shared/components/base-page/base-page';

export const JobVariantCreatePage = () => {
	return (
		<BasePage titlePage="Создание вида работы">
			<JobVariantCreateForm />
		</BasePage>
	);
};
