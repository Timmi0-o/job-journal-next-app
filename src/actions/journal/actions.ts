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
import { IJournalCreate } from './models/journal-create.schema';
import { IJournalEdit } from './models/journal-edit.schema';
import { IJournal } from './models/journal.schema';

const REVALIDATE_PATH = '/journals';

export const journalsGet = async ({
	...options
}: Partial<IGetActionOptions>): Promise<IActionResponse<IJournal[]>> => {
	return abstractGetAction<IJournal[]>({
		url: API_ROUTES.journal.journals,
		params: { method: 'GET', cache: 'no-store' },
		isArray: true,
		...options,
	});
};

export const journalGetOne = async ({
	...options
}: Partial<IGetActionOptions>): Promise<IActionResponse<IJournal>> => {
	return abstractGetAction<IJournal>({
		url: API_ROUTES.journal.journalOne(options.id!),
		params: { method: 'GET', cache: 'no-store', ...options?.params },
		...options,
	});
};

export const journalsCreate = async ({
	...options
}: Partial<IMutateActionOptions<IJournalCreate>>): Promise<
	IActionResponse<IJournal>
> => {
	return abstractMutateAction<IJournalCreate, IJournal>({
		url: API_ROUTES.journal.journalCreate,
		...options,
		params: { method: 'POST', ...options?.params },
		onOk: (): void => revalidatePath(REVALIDATE_PATH),
	});
};

export const journalsEdit = async ({
	...options
}: Partial<IMutateActionOptions<IJournalEdit>>): Promise<
	IActionResponse<IJournal>
> => {
	return abstractMutateAction<IJournalEdit, IJournal>({
		url: API_ROUTES.journal.journalEdit(options?.params?.body?.id ?? ''),
		...options,
		params: { method: 'PATCH', ...options?.params },
		onOk: (): void => revalidatePath(REVALIDATE_PATH),
	});
};

export const journalsDelete = async ({
	id,
	...options
}: Partial<IMutateActionOptions<undefined>> & {
	id: string;
}): Promise<IActionResponse<boolean>> => {
	return abstractMutateAction<undefined, boolean>({
		url: API_ROUTES.journal.journalDelete(id),
		...options,
		params: { method: 'DELETE', ...options?.params },
		onOk: (): void => revalidatePath(REVALIDATE_PATH),
	});
};
