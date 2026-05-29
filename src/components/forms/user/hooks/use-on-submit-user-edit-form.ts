'use client';

import { usersEdit } from '@/actions/user/actions';
import {
	IUserEdit,
	UserEditSchema,
} from '@/actions/user/models/user-edit.schema';
import { IUser } from '@/actions/user/models/user.schema';
import { toast } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { SubmitHandler } from 'react-hook-form';

export const useOnSubmitUserEditForm = (id: string) => {
	const router = useRouter();

	return useCallback(
		async (data: IUserEdit) => {
			const validatedData = UserEditSchema.safeParse({ ...data, id });

			if (!validatedData.success) {
				return toast.danger('Ошибка в данных', {
					description: validatedData.error.message,
				});
			}

			const { error } = await usersEdit({
				params: {
					body: validatedData.data,
				},
			});

			if (error?.message) {
				toast.danger('Ошибка', { description: error.message });
				return;
			}

			toast('Пользователь успешно обновлён');
			router.back();
		},
		[id, router]
	);
};

export const useUserForm = (id: string) => {
	const onSubmit = useOnSubmitUserEditForm(id);

	return {
		handleSubmit: onSubmit as SubmitHandler<IUserEdit>,
	};
};
