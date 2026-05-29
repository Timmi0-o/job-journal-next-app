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
import { IUnitCreate } from './models/unit-create.schema';
import { IUnitEdit } from './models/unit-edit.schema';
import { IUnit } from './models/unit.schema';

const REVALIDATE_PATH = '/units';

export const unitsGet = async ({
	...options
}: Partial<IGetActionOptions>): Promise<IActionResponse<IUnit[]>> => {
	return abstractGetAction<IUnit[]>({
		url: API_ROUTES.unit.units,
		params: { method: 'GET', cache: 'no-store' },
		isArray: true,
		...options,
	});
};

export const unitGetOne = async ({
	...options
}: Partial<IGetActionOptions>): Promise<IActionResponse<IUnit>> => {
	return abstractGetAction<IUnit>({
		url: API_ROUTES.unit.unitOne(options.id!),
		params: { method: 'GET', cache: 'no-store', ...options?.params },
		...options,
	});
};

export const unitsCreate = async ({
	...options
}: Partial<IMutateActionOptions<IUnitCreate>>): Promise<
	IActionResponse<IUnit>
> => {
	return abstractMutateAction<IUnitCreate, IUnit>({
		url: API_ROUTES.unit.unitCreate,
		...options,
		params: { method: 'POST', ...options?.params },
		onOk: (): void => revalidatePath(REVALIDATE_PATH),
	});
};

export const unitsEdit = async ({
	...options
}: Partial<IMutateActionOptions<IUnitEdit>>): Promise<
	IActionResponse<IUnit>
> => {
	return abstractMutateAction<IUnitEdit, IUnit>({
		url: API_ROUTES.unit.unitEdit(options?.params?.body?.id ?? ''),
		...options,
		params: { method: 'PATCH', ...options?.params },
		onOk: (): void => revalidatePath(REVALIDATE_PATH),
	});
};

export const unitsDelete = async ({
	id,
	...options
}: Partial<IMutateActionOptions<undefined>> & {
	id: string;
}): Promise<IActionResponse<boolean>> => {
	return abstractMutateAction<undefined, boolean>({
		url: API_ROUTES.unit.unitDelete(id),
		...options,
		params: { method: 'DELETE', ...options?.params },
		onOk: (): void => revalidatePath(REVALIDATE_PATH),
	});
};
