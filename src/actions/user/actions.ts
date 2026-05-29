'use server';

import { API_ROUTES } from '@/constants/api-routes.constant';
import {
	abstractGetAction,
	abstractMutateAction,
} from '@/helpers/action.helper';
import {
	IActionResponse,
	IGetActionOptions,
	IMutateActionOptions,
} from '@/types/i-action.types';
import { revalidatePath } from 'next/cache';
import { IUserCreate } from './models/user-create.schema';
import { IUserEdit } from './models/user-edit.schema';
import { IUser } from './models/user.schema';

const REVALIDATE_PATH = '/users';

export const usersGet = async ({
	...options
}: Partial<IGetActionOptions>): Promise<IActionResponse<IUser[]>> => {
	return abstractGetAction<IUser[]>({
		url: API_ROUTES.user.users,
		params: { method: 'GET', cache: 'no-store' },
		isArray: true,
		...options,
	});
};

export const userGetOne = async ({
	...options
}: Partial<IGetActionOptions>): Promise<IActionResponse<IUser>> => {
	return abstractGetAction<IUser>({
		url: API_ROUTES.user.userOne(options.id!),
		params: { method: 'GET', cache: 'no-store', ...options?.params },
		...options,
	});
};

export const usersCreate = async ({
	...options
}: Partial<IMutateActionOptions<IUserCreate>>): Promise<
	IActionResponse<IUser>
> => {
	return abstractMutateAction<IUserCreate, IUser>({
		url: API_ROUTES.user.userCreate,
		...options,
		params: { method: 'POST', ...options?.params },
		onOk: (): void => revalidatePath(REVALIDATE_PATH),
	});
};

export const usersEdit = async ({
	...options
}: Partial<IMutateActionOptions<IUserEdit>>): Promise<
	IActionResponse<IUser>
> => {
	return abstractMutateAction<IUserEdit, IUser>({
		url: API_ROUTES.user.userEdit(options?.params?.body?.id ?? ''),
		...options,
		params: { method: 'PATCH', ...options?.params },
		onOk: (): void => revalidatePath(REVALIDATE_PATH),
	});
};

export const usersDelete = async ({
	id,
	...options
}: Partial<IMutateActionOptions<undefined>> & {
	id: string;
}): Promise<IActionResponse<boolean>> => {
	return abstractMutateAction<undefined, boolean>({
		url: API_ROUTES.user.userDelete(id),
		...options,
		params: { method: 'DELETE', ...options?.params },
		onOk: (): void => revalidatePath(REVALIDATE_PATH),
	});
};
