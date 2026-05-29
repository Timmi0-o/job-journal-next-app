'use client';

import {
	userGetOne,
	usersCreate,
	usersDelete,
	usersEdit,
	usersGet,
} from '@/actions/user/actions';
import { IUser } from '@/actions/user/models/user.schema';
import { IUserCreate } from '@/actions/user/models/user-create.schema';
import { IUserEdit } from '@/actions/user/models/user-edit.schema';
import { createEntityHooks } from '../create-entity-hooks';

export const {
	useGetList: useUsers,
	useGetOne: useUser,
	useCreate: useCreateUser,
	useUpdate: useUpdateUser,
	useDelete: useDeleteUser,
} = createEntityHooks<IUser, IUserCreate, IUserEdit>(
	'user',
	{
		getList: usersGet,
		getOne: userGetOne,
		create: usersCreate,
		edit: usersEdit,
		remove: usersDelete,
	},
	{
		created: 'Пользователь создан',
		updated: 'Пользователь обновлён',
		deleted: 'Пользователь удалён',
		error: 'Ошибка',
	}
);
