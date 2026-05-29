'use client';

import { UserCreateForm } from '@/components/forms/user/user-create-form';
import { BasePage } from '@/components/shared/components/base-page/base-page';

export const UserCreatePage = () => {
	return (
		<BasePage titlePage="Создание пользователя">
			<UserCreateForm />
		</BasePage>
	);
};
