'use client';

import {
	journalGetOne,
	journalsCreate,
	journalsDelete,
	journalsEdit,
	journalsGet,
} from '@/actions/journal/actions';
import { IJournal } from '@/actions/journal/models/journal.schema';
import { IJournalCreate } from '@/actions/journal/models/journal-create.schema';
import { IJournalEdit } from '@/actions/journal/models/journal-edit.schema';
import { createEntityHooks } from '../create-entity-hooks';

export const {
	useGetList: useJournals,
	useGetOne: useJournal,
	useCreate: useCreateJournal,
	useUpdate: useUpdateJournal,
	useDelete: useDeleteJournal,
} = createEntityHooks<IJournal, IJournalCreate, IJournalEdit>(
	'journal',
	{
		getList: journalsGet,
		getOne: journalGetOne,
		create: journalsCreate,
		edit: journalsEdit,
		remove: journalsDelete,
	},
	{
		created: 'Запись создана',
		updated: 'Запись обновлена',
		deleted: 'Запись удалена',
		error: 'Ошибка',
	}
);
