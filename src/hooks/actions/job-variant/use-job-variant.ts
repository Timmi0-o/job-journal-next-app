'use client';

import {
	jobVariantGetOne,
	jobVariantsCreate,
	jobVariantsDelete,
	jobVariantsEdit,
	jobVariantsGet,
} from '@/actions/job-variant/actions';
import { IJobVariant } from '@/actions/job-variant/models/job-variant.schema';
import { IJobVariantCreate } from '@/actions/job-variant/models/job-variant-create.schema';
import { IJobVariantEdit } from '@/actions/job-variant/models/job-variant-edit.schema';
import { createEntityHooks } from '../create-entity-hooks';

export const {
	useGetList: useJobVariants,
	useGetOne: useJobVariant,
	useCreate: useCreateJobVariant,
	useUpdate: useUpdateJobVariant,
	useDelete: useDeleteJobVariant,
} = createEntityHooks<IJobVariant, IJobVariantCreate, IJobVariantEdit>(
	'job-variant',
	{
		getList: jobVariantsGet,
		getOne: jobVariantGetOne,
		create: jobVariantsCreate,
		edit: jobVariantsEdit,
		remove: jobVariantsDelete,
	},
	{
		created: 'Вид работы создан',
		updated: 'Вид работы обновлён',
		deleted: 'Вид работы удалён',
		error: 'Ошибка',
	}
);
