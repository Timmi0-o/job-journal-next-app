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
import { IJobVariantCreate } from './models/job-variant-create.schema';
import { IJobVariantEdit } from './models/job-variant-edit.schema';
import { IJobVariant } from './models/job-variant.schema';

const REVALIDATE_PATH = '/job-variants';

export const jobVariantsGet = async ({
	...options
}: Partial<IGetActionOptions>): Promise<IActionResponse<IJobVariant[]>> => {
	return abstractGetAction<IJobVariant[]>({
		url: API_ROUTES.jobVariant.jobVariants,
		params: { method: 'GET', cache: 'no-store' },
		isArray: true,
		...options,
	});
};

export const jobVariantGetOne = async ({
	...options
}: Partial<IGetActionOptions>): Promise<IActionResponse<IJobVariant>> => {
	return abstractGetAction<IJobVariant>({
		url: API_ROUTES.jobVariant.jobVariantOne(options.id!),
		params: { method: 'GET', cache: 'no-store', ...options?.params },
		...options,
	});
};

export const jobVariantsCreate = async ({
	...options
}: Partial<IMutateActionOptions<IJobVariantCreate>>): Promise<
	IActionResponse<IJobVariant>
> => {
	return abstractMutateAction<IJobVariantCreate, IJobVariant>({
		url: API_ROUTES.jobVariant.jobVariantCreate,
		...options,
		params: { method: 'POST', ...options?.params },
		onOk: (): void => revalidatePath(REVALIDATE_PATH),
	});
};

export const jobVariantsEdit = async ({
	...options
}: Partial<IMutateActionOptions<IJobVariantEdit>>): Promise<
	IActionResponse<IJobVariant>
> => {
	return abstractMutateAction<IJobVariantEdit, IJobVariant>({
		url: API_ROUTES.jobVariant.jobVariantEdit(options?.params?.body?.id ?? ''),
		...options,
		params: { method: 'PATCH', ...options?.params },
		onOk: (): void => revalidatePath(REVALIDATE_PATH),
	});
};

export const jobVariantsDelete = async ({
	id,
	...options
}: Partial<IMutateActionOptions<undefined>> & {
	id: string;
}): Promise<IActionResponse<boolean>> => {
	return abstractMutateAction<undefined, boolean>({
		url: API_ROUTES.jobVariant.jobVariantDelete(id),
		...options,
		params: { method: 'DELETE', ...options?.params },
		onOk: (): void => revalidatePath(REVALIDATE_PATH),
	});
};
